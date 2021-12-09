import base64
from uuid import uuid4

import environ
from django.db.utils import IntegrityError
from django.http.response import FileResponse
from django_filters.rest_framework import DjangoFilterBackend
from formulario.models import Exportacion, Lenguaje, Pais, SAHashes, SociedadAnonima, Socio, SocioSA
from formulario.permissions import bonita_permission
from formulario.serializers import (SociedadAnonimaRetrieveSerializer,
                                    SociedadAnonimaSerializer)
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from services.bonita_service import (assign_task, bonita_login_call,
                                     execute_task, set_bonita_variable,
                                     start_bonita_process)
from services.estampillado_service import api_call_with_retry, complementaria_api_call, request_stamp
from services.mail_service import (mail_estatuto_invalido, mail_fin_solicitud, mail_num_expediente,
                                   mail_solicitud_incorrecta)

from services.types import BonitaNotOpenException

# # el objeto env se usa para traer las variables de entorno
env = environ.Env()
environ.Env.read_env()


def process_partners(sa, partners, update=False):
    if update:
        queryset = SocioSA.objects.filter(sa_id=sa.id)
        queryset.delete()
    for socio in partners:
        partner = Socio.objects.get(
            pk=socio['id']) if type(socio) == int else socio['id']
        sa.partners.add(
            partner, through_defaults={'percentage': socio['percentage'], 'is_representative': socio.get('is_representative', False)})


def process_exports(sa, export_info, update=False):
    # Si se esta haciendo una actualizacion, borro todas las tuplas que hubiera anteriormente
    # antes de crear las nuevas
    if update:
        queryset = Exportacion.objects.filter(sa_id=sa.id)
        queryset.delete()
    for continent in export_info:
        for country in continent['countries']:
            new_country, created = Pais.objects.get_or_create(
                code=country['code'], name=country['name'])
            for language in country['languages']:
                new_language, created = Lenguaje.objects.get_or_create(
                    code=language['code'], name=language['name'], native_name=language['native'])
                new_country.languages.add(new_language)
            exportacion = Exportacion.objects.create(
                sa=sa, continent_code=continent['code'], continent_name=continent['name'], country=new_country, states=country['states'])
            exportacion.save()


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

    def update(self, request, pk=None):
        try:
            bonita_login_call(request.session, 'Apoderado1', 'bpm')
        except BonitaNotOpenException:
            return Response(data='El servidor de bonita no se encuentra corriendo. Abortando...')

        try:
            sa = SociedadAnonima.objects.get(pk=pk)
            sa_by_name = SociedadAnonima.objects.filter(
                name=request.data['name']).first()
            if sa_by_name and sa.id != sa_by_name.id:
                return Response(data="Ya existe otra sociedad con ese mismo nombre", status=status.HTTP_400_BAD_REQUEST)
        except SociedadAnonima.DoesNotExist:
            return Response(data='La sociedad solicitada no existe', status=status.HTTP_400_BAD_REQUEST)

        serializer = SociedadAnonimaSerializer(data=request.data)
        if serializer.is_valid():
            data = request.data
            sa.name = data['name']
            sa.legal_domicile = data['legal_domicile']
            sa.creation_date = data['creation_date']
            sa.real_domicile = data['real_domicile']
            sa.representative_email = data['representative_email']
            sa.save()
            process_partners(sa, data['partners'], update=True)
            process_exports(sa, data['exports'], update=True)

            # Se asigna la tarea y se ejecuta
            task_id = assign_task(request.session, sa.case_id)
            execute_task(request.session, task_id)

            return Response(data=serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        """
        Este metodo define la creacion de los objetos Sociedad Anonima
        """
        try:
            # Por ahora, el login hardcodeado cada vez que se crea una SA
            bonita_login_call(request.session, 'Apoderado1', 'bpm')
        except BonitaNotOpenException:
            return Response(data='El servidor de bonita no se encuentra corriendo. Abortando...')

        try:
            if SociedadAnonima.objects.get(name=request.data['name']):
                return Response(data="Ya existe una sociedad con ese mismo nombre", status=status.HTTP_400_BAD_REQUEST)
        except SociedadAnonima.DoesNotExist:
            pass

        serializer = SociedadAnonimaSerializer(data=request.data)
        if serializer.is_valid():
            data = request.data

            # Se crea la nueva SA y se guarda
            new_sa = SociedadAnonima.objects.create(name=data['name'], legal_domicile=data['legal_domicile'],
                                                    creation_date=data['creation_date'], real_domicile=data['real_domicile'],
                                                    representative_email=data['representative_email'])

            # Se crea nuevo objeto con el hash asignado
            hash_object = SAHashes.objects.create(sa=new_sa, hash=uuid4().hex)

            # Se agregan los socios que hayan venido
            partners = data['partners']
            process_partners(new_sa, partners)

            # Se crean los datos de exportacion
            export_info = data['exports']
            process_exports(new_sa, export_info)

            # Se inicia el proceso en bonita si se esta local
            if env('DJANGO_DEVELOPMENT') == 'True':
                new_case = start_bonita_process(
                    request.session, new_sa, hash_object.hash)
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

            if 'update' in request.data and request.data['update'] == 'true':
                # Se asigna la tarea y se ejecuta
                task_id = assign_task(request.session, sa.case_id)
                execute_task(request.session, task_id)

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
        if request_stamp(sa):
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
                if not mail_solicitud_incorrecta(sa, apoderado.first_name):
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
                # Aca llamar a api de estampillado (SOLO SI VIENE DE BONITA, SINO SE HACE EN EL FRONT)
                if user_agent.startswith('Java'):
                    request_stamp(sa)
            else:
                if not mail_estatuto_invalido(sa, apoderado.first_name, request.data['observaciones']):
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

    @action(detail=True)
    def crear_carpeta_digital(self, request, pk=None):
        """
        Este endpoint realiza la creacion de una carpeta DIGITAL dada una sociedad anonima, en google drive.
        """
        sa = self.get_object()
        if not sa.stamp_hash:
            return Response(data='La sociedad con el id dado aun no tiene estampillado', status=status.HTTP_400_BAD_REQUEST)
        partners = sa.sociosa_set.all()

        # Obtener qr del servicio
        qr = api_call_with_retry(
            method='get', endpoint='/api/estampillado/', url_params=sa.stamp_hash)['qr']
        payload = {
            "nombre_sociedad": sa.name,
            "fecha_creacion": sa.creation_date.strftime('%d/%m/%Y'),
            "qr": qr,
            "estatuto": base64.b64encode(
                sa.comformation_statute.read()).decode('ascii'),
        }

        # Iterar socios y agregarlos al payload
        for i, socioSA in enumerate(partners):
            payload[f'socios[{i}][nombre]'] = socioSA.partner.first_name
            payload[f'socios[{i}][aporte]'] = int(socioSA.percentage)

        # Llamar a api
        response = complementaria_api_call(
            method='post', endpoint='/api/drive/carpeta-digital', data=payload)

        sa.drive_folder_link = response['success']['url']
        sa.save()

        # Traer info de apoderado (para envio de mails)
        apoderado = sa.sociosa_set.get(is_representative=True).partner
        if not mail_fin_solicitud(sa, apoderado.first_name):
            print("el email de fin de proceso NO pudo ser enviado...")

        if response['status'] == 200:
            return Response(data='La carpeta digital fue creada con exito. El archivo pdf se puede ver en ' + response['success']['url'])
        else:
            return Response(data='Hubo algun error al crear la carpeta digital', status=status.HTTP_502_BAD_GATEWAY)
