import environ
from rest_framework import status, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from formulario.models import Socio, SociedadAnonima
from formulario.serializers import FileSerializer, SociedadAnonimaRetrieveSerializer, SociedadAnonimaSerializer, SocioSerializer

from utils.bonita_service import start_bonita_process

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
    # IMPORTANTE cambiar esto cuando haya autenticacion
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Se admite un parametro 'name', para filtrar sociedades por nombre, y ver si ya existen.
        Sin este filtro, se devuelven todas las sociedades
        """
        queryset = SociedadAnonima.objects.all()
        name = self.request.query_params.get('name')
        if name:
            # El filter se hace por nombre completo, entonces, debe coincidir completamente
            queryset = queryset.filter(name=name.lower())
        return queryset

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
                # !! Por ahora el porcentaje esta hardcodeado hasta que este el array de socios del front
                new_sa.partners.add(
                    partner, through_defaults={'percentage': socio['percentage'], 'is_representative': socio.get('is_representative', False)})

            # Tengo que agregar el ID de la nueva instancia al serializer para devolverlo
            response_data = serializer.data
            response_data['id'] = new_sa.id

            # Se inicia el proceso en bonita si se esta local
            if env('DJANGO_DEVELOPMENT') == 'True':
                if (not start_bonita_process(new_sa)):
                    print(
                        '---> Hubo algun problema al iniciar el caso de bonita. Sin embargo, la SA fue creada correctamente')
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

    # def get_serializer_class(self):
    #     if self.action == 'create':
    #         return SociedadAnonimaSerializer
    #     else:
    #         return SociedadAnonimaRetrieveSerializer
