import base64
from datetime import datetime, timedelta
from uuid import uuid4

import environ
from django.db.utils import IntegrityError
from django.http.response import FileResponse
from django_filters.rest_framework import DjangoFilterBackend
from formulario.models import SociedadAnonima, Socio
from formulario.permissions import bonita_permission
from formulario.serializers import (SociedadAnonimaRetrieveSerializer,
                                    SociedadAnonimaSerializer)
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from services.bonita_service import (assign_task, bonita_login_call,
                                     execute_task, set_bonita_variable,
                                     start_bonita_process)
from services.estampillado_service import api_call_with_retry
from services.mail_service import (mail_estatuto_invalido, mail_num_expediente,
                                   mail_solicitud_incorrecta)

# # el objeto env se usa para traer las variables de entorno
env = environ.Env()
environ.Env.read_env()


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

        Body (form-data):
            * file: Archivo de estatuto. Debe ser pdf / docx / odt y pesar 2MB o menos.
        """
        sa = self.get_object()
        if 'file' in request.data:
            file = request.data['file']
            file_name = file.name.split(".")[-1]
            if file_name not in ('pdf', 'docx', 'odt') or file.size > 2000000:
                return Response(data='El archivo tiene que tener formato pdf y ser de 2MB o menos',
                                status=status.HTTP_400_BAD_REQUEST)
            sa.comformation_statute.save(file.name, file, save=True)
            return Response({'status': 'Archivo guardado con exito'})
        else:
            return Response(data='El archivo pdf no fue enviado.', status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True)
    def solicitar_estampillado(self, request, pk=None):
        """
        Este endpoint dispara una solicitud de estampillado a la api de estampillado externa, dado un id de sociedad.
        """
        if not bonita_permission(request, 'Escribano'):
            return Response(data='Debe ser rol Escribano para usar este endpoint', status=status.HTTP_403_FORBIDDEN)
        sa = self.get_object()
        if not sa.comformation_statute.name:
            return Response(data='Esta sociedad aun no tiene un estatuto de conformacion subido', status=status.HTTP_400_BAD_REQUEST)
        if not sa.numero_expediente:
            return Response(data='Esta sociedad aun no ha sido aprobada por mesa de entrada', status=status.HTTP_400_BAD_REQUEST)
        numero_expediente = sa.numero_expediente
        base64_file = base64.b64encode(
            sa.comformation_statute.read()).decode('ascii')
        response = api_call_with_retry(
            method='post', endpoint='/api/estampillado', data={"estatuto": base64_file, "num_expediente": numero_expediente, "url_organismo_solicitante": "localhost:8000/sociedad_anonima/ver"})
        if not 'status' in response:
            sa.stamp_hash = response['hash']
            sa.save()
            return Response(data='Estampillado solicitado con exito', status=status.HTTP_200_OK)
        else:
            return Response(data='La sociedad ya ha tenido un estampillado exitoso anteriormente', status=status.HTTP_502_BAD_GATEWAY)

    @action(detail=True)
    def obtener_estampillado(self, request, pk=None):
        sa = self.get_object()
        if not sa.stamp_hash:
            return Response(data='La sociedad con el id dado aun no tiene estampillado', status=status.HTTP_400_BAD_REQUEST)
        hash = sa.stamp_hash
        response = api_call_with_retry(
            method='get', endpoint='/api/estampillado/', url_params=hash)
        return Response(data=response, status=status.HTTP_200_OK) if response else Response(status=status.HTTP_502_BAD_GATEWAY)

    @action(detail=True, methods=['post'])
    def veredicto_mesa_entrada(self, request, pk=None):
        """
        Este endpoint maneja la aprobacion / rechazo de una sociedad por parte de un empleado de mesa de entrada.

        Body:
            * veredicto (boolean): true si se quiere aprobar, de lo contrario false.
        """
        if not bonita_permission(request, 'Empleado mesa'):
            return Response(data='Debe ser rol Empleado mesa para usar este endpoint', status=status.HTTP_403_FORBIDDEN)
        # serializer = VerdictSerializer(data=request.data)
        if 'veredicto' in request.data:
            sa = self.get_object()
            # Si la sociedad ya fue aprobada anteriormente, NO SEGUIR
            if sa.numero_expediente:
                return Response('Esta sociedad ya fue aprobada anteriormente. Abortando...', status=status.HTTP_400_BAD_REQUEST)

            # Traer info de apoderado (para envio de mails)
            apoderado = sa.sociosa_set.get(is_representative=True).partner

            verdict = request.data['veredicto']
            if verdict:
                # Seteo el numero aleatorio de expediente
                try:
                    sa.numero_expediente = uuid4().hex
                    sa.save()
                except IntegrityError:
                    # En el caso astronomico que se repita un uuid, generar uno nuevo
                    print(
                        'El numero generado resulto estar repetido. Intentando de nuevo...')
                    sa.numero_expediente = uuid4().hex
                    sa.save()
                # Envio email de confirmacion
                if not mail_num_expediente(
                        sa.name, apoderado.first_name, sa.representative_email, sa.numero_expediente):
                    # !! tal vez aca, revertir transacciones
                    print('El mail de num expediente NO pudo enviarse...')
            else:
                # Definir la fecha limite de correcciones (A RECIBIR POR PARAMETRO)
                # !! Por ahora, 7 dias desde dia actual
                limit_date = (datetime.now() + timedelta(days=7)
                              ).strftime('%d-%m-%Y')
                if not mail_solicitud_incorrecta(
                        sa.name, apoderado.first_name, sa.representative_email, limit_date):
                    # !! tal vez aca, revertir transacciones
                    print('El mail de correcciones NO pudo enviarse...')

            # Acciones de bonita
            set_bonita_variable(request.session, sa.case_id,
                                'aprobado_por_mesa', verdict)
            task_id = assign_task(request.session, sa.case_id)
            execute_task(request.session, task_id)

            return Response(status=status.HTTP_200_OK)
        else:
            return Response('No se ha enviado el parametro veredicto', status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True)
    def obtener_estatuto(self, request, pk=None):
        """
        Este metodo devuelve el PDF del estatuto de una sociedad dada por ID, para ser descargado
        """
        if not bonita_permission(request, 'Escribano'):
            # Se necesita ser Escribano para acceder
            return Response(data='Debe ser rol Escribano para usar este endpoint', status=status.HTTP_403_FORBIDDEN)
        sa = self.get_object()
        file = sa.comformation_statute.open()

        response = FileResponse(file, filename='estatuto',
                                content_type='application/pdf')
        return response

    @action(detail=True, methods=['post'])
    def evaluar_estatuto(self, request, pk=None):
        """
        Este metodo sirve para determinar si el estatuto se evaluo correctamente o no.

        Body:
            * veredicto (boolean): true si se quiere aprobar, de lo contrario false.
            * correcciones (string separado por ;) : serie de correcciones SEPARADO POR PUNTO Y COMA.
        """
        user_agent = request.headers['User-Agent']
        if user_agent.startswith('Java'):
            # SOLO si el request viene del script de bonita, hardcodeo el login
            bonita_login_call(request.session, 'JuancitoEscribano', 'bpm')

        if not bonita_permission(request, 'Escribano'):
            # Se necesita ser Escribano para acceder
            return Response(data='Debe ser rol Escribano para usar este endpoint', status=status.HTTP_403_FORBIDDEN)
        if 'veredicto' in request.data:
            sa = self.get_object()

            # Traer info de apoderado (para envio de mails)
            apoderado = sa.sociosa_set.get(is_representative=True).partner

            verdict = request.data['veredicto']
            if verdict:
                # TODO Aca llamar a api de estampillado (SE HACE DESDE EL FRONT)
                pass
            else:
                if not mail_estatuto_invalido(sa.name, apoderado.first_name, sa.representative_email, request.data['observaciones']):
                    print('El mail de estatuto rechazado NO pudo enviarse...')

            # Acciones de bonita
            set_bonita_variable(request.session, sa.case_id,
                                'estatuto_aprobado', verdict)
            if not user_agent.startswith('Java'):
                # Si vino del script de bonita, NO hay que avanzar la tarea a mano, ya lo hizo el motor de bonita
                task_id = assign_task(request.session, sa.case_id)
                execute_task(request.session, task_id)

            return Response(status=status.HTTP_200_OK)
        else:
            return Response('No se ha enviado el parametro veredicto', status=status.HTTP_400_BAD_REQUEST)
