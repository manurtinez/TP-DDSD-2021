import environ
from formulario.BonitaAuthentication import BonitaAuthentication
from formulario.BonitaPermission import BonitaPermission

from formulario.permissions import check_bonita_permission

from rest_framework import status, permissions, viewsets
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from formulario.models import Socio, SociedadAnonima
from formulario.serializers import FileSerializer, SociedadAnonimaRetrieveSerializer, SociedadAnonimaSerializer, SocioSerializer

from services.bonita_service import assign_task, bonita_login_call, execute_task, get_cases_for_task, start_bonita_process, bonita_logout
from services.estampillado_service import api_call_with_retry

# # el objeto env se usa para traer las variables de entorno
env = environ.Env()
environ.Env.read_env()

# IMPORTANTE por ahora esta API esta abierta, sin embargo cuando llegue el momento va a tener que autenticarse para
# accederla

# Create your views here.


class SocioViewSet(viewsets.ModelViewSet):
    """
    Este ViewSet provee acciones `list`, `create`, `retrieve`,
    `update` and `destroy` para el modelo Socio.
    """
    serializer_class = SocioSerializer
    # IMPORTANTE cambiar esto cuando haya autenticacion
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Se puede pasar un URL param "dni" para obtener el socio con ese dni (si existe).
        Si no se pasa nada, retorna todos los socios.
        """
        queryset = Socio.objects.all()
        dni = self.request.query_params.get('dni')
        if dni is not None:
            queryset = queryset.filter(dni=dni)
        return queryset


class SociedadAnonimaViewSet(viewsets.ModelViewSet):
    """
    Este ViewSet provee acciones `list`, `create`, `retrieve`,
    `update` and `destroy` para el modelo SociedadAnonima.
    """
    serializer_class = SociedadAnonimaRetrieveSerializer
    queryset = SociedadAnonima.objects.all()
    # IMPORTANTE cambiar esto cuando haya autenticacion
    permission_classes = [permissions.AllowAny]
    # Filtros para permitir buscar por name y hash
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'stamp_hash']

    def create(self, request):
        """
        Este metodo define la creacion de los objetos Sociedad Anonima
        """
        serializer = SociedadAnonimaSerializer(data=request.data)

        if serializer.is_valid():
            data = request.data

            # Se crea la nueva SA y se guarda
            new_sa = SociedadAnonima.objects.create(name=data['name'], legal_domicile=data['legal_domicile'], creation_date=data['creation_date'],
                                                    real_domicile=data['real_domicile'], export_countries=data['export_countries'],
                                                    representative_email=data['representative_email'])

            # Se agregan los socios que hayan venido
            partners = data['partners']
            for socio in partners:
                partner = Socio.objects.get(pk=socio['id'])
                new_sa.partners.add(
                    partner, through_defaults={'percentage': socio['percentage'], 'is_representative': socio.get('is_representative', False)})

            # Se inicia el proceso en bonita si se esta local
            if env('DJANGO_DEVELOPMENT') == 'True':
                new_case = start_bonita_process(request.session, new_sa)
                if (not new_case):
                    print(
                        '---> Hubo algun problema al iniciar el caso de bonita. Sin embargo, la SA fue creada correctamente')
                else:
                    # Se creo con exito el caso, se asigna a la sociedad
                    new_sa.case_id = int(new_case['id'])
                    new_sa.save()
                    # Se asigna la tarea y se ejecuta
                    task_id = assign_task(request.session, new_case['id'])
                    execute_task(request.session, task_id)

            # Tengo que agregar el ID de la nueva instancia y del caso al serializer por si se necesitan
            response_data = serializer.data
            response_data['id'] = new_sa.id
            response_data['case_id'] = new_sa.case_id

            return Response(data=response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_name='upload_file')
    def subir_archivo(self, request, pk=None):
        """
        Este action maneja la accion de agregar un archivo manifesto a la sociedad anonima.
        """
        sa = self.get_object()
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            file = request.data['file']
            sa.comformation_statute.save(file.name, file, save=True)
            return Response({'status': 'Archivo guardado con exito'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True)
    def solicitar_estampillado(self, request, pk=None):
        sa = self.get_object()
        # TODO implementar
        pass

    @action(detail=True)
    def obtener_estampillado(self, request, pk=None):
        sa = self.get_object()
        # hash = sa.stamp_hash
        hash = '89ff31470d00b95eaf0895fd95f5d321'
        # Por ahora el hash hardcodeado
        response = api_call_with_retry(
            method='get', endpoint='/api/estampillado/', url_params=hash)
        return Response(data=response, status=status.HTTP_200_OK) if response else Response(status=status.HTTP_502_BAD_GATEWAY)


class BonitaViewSet(viewsets.ViewSet):
    """
    Este viewset define todos los endpoints y actions necesarios para hacer operaciones con Bonita
    """
    # IMPORTANTE cambiar esto cuando haya autenticacion
    permission_classes = [BonitaPermission]
    authentication_classes = [BonitaAuthentication]

    # @action(detail=False, url_path=r'obtener_por_task/(?P<task_name>\d+)')
    @action(detail=False)
    def obtener_por_task(self, request, *args, **kwargs):
        """
        Este endpoint devuelve una lista de sociedades que estan parados en task_name

        Params:
            * task_name(str): nombre literal de tarea del modelo bonita. Por ejemplo: "Revisión de información"

        Returns:
            * list[int] | None
        """
        case_ids = get_cases_for_task(request.session, kwargs['task_name'])
        queryset = SociedadAnonima.objects.filter(case_id__in=case_ids)
        serializer = SociedadAnonimaRetrieveSerializer(queryset, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_pattern='logout')
    def bonita_logout(self, request):
        if bonita_logout():
            request.session.flush()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(data='Hubo algun problema al hacer el logout.', status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['post'])
@permission_classes([permissions.AllowAny])
def bonita_login(request):
    data = request.data
    response_code = bonita_login_call(request.session,
                                      data['user'], data['password'])
    if response_code == 204:
        return Response(status=status.HTTP_200_OK)
    elif response_code == 401:
        return Response(data="Las credenciales fueron incorrectas", status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(data="Hubo algun problema interno realizando el login", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def pendientes(request):
    return check_bonita_permission(request, 'listadoDeSociedadesPendientes.html', 'Empleado mesa')
