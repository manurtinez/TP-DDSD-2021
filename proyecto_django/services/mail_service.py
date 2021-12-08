from datetime import datetime, timedelta
import requests
import environ

from formulario.models import SAHashes

# # el objeto env se usa para traer las variables de entorno
env = environ.Env()
environ.Env.read_env()

BASE_URL = env('API_COMPLEMENTARIA_URL') + '/api/email/send'


def mail_solicitud_incorrecta(sa, nombre_apoderado):
    """
    Este metodo realiza el envio del mail de solicitud RECHAZADA por mesa de entradas
    """
    try:
        # !! Definir la fecha limite de correcciones (A RECIBIR POR PARAMETRO)
        # !! Por ahora, 7 dias desde dia actual
        limit_date = (datetime.now() + timedelta(days=7)
                      ).strftime('%d-%m-%Y')
        sa_name = sa.name
        to = sa.representative_email

        # Obtengo el hash para la url de editar
        hash = SAHashes.objects.get(sa_id=sa.id).hash
        url = f'http://localhost:8000/sociedad_anonima/{sa.id}/editar/{hash}/'

        payload = {'nombre_sociedad': sa_name,
                   'nombre_apoderado': nombre_apoderado,
                   'destinatario': to,
                   'plazo_correccion': limit_date,
                   'url_boton': url}
        response = requests.post(
            BASE_URL + '/informacion-sociedad-incorrecta', data=payload)
        if response.status_code == 200:
            return True
    except requests.exceptions.RequestException as e:
        print(e)
    return False


def mail_num_expediente(nombre_sa, nombre_apoderado, destinatario, num_expediente):
    """
    Este metodo realiza el envio del mail de solicitud ACEPTADA  por mesa de entradas
    """
    try:
        payload = {'nombre_sociedad': nombre_sa,
                   'nombre_apoderado': nombre_apoderado,
                   'destinatario': destinatario,
                   'num_expediente': num_expediente}
        response = requests.post(
            BASE_URL + '/expediente', data=payload)
        if response.status_code == 200:
            return True
    except requests.exceptions.RequestException as e:
        print(e)
    return False


def mail_estatuto_invalido(sa, nombre_apoderado, observaciones):
    """
    Este metodo realiza el envio del mail de solicitud RECHAZADA por parte de legales
    """
    try:
        sa_name = sa.name
        to = sa.representative_email
        edit_url = f'http://localhost:8000/sociedad_anonima/{sa.id}/estatuto/editar/'

        payload = {'nombre_sociedad': sa_name,
                   'nombre_apoderado': nombre_apoderado,
                   'destinatario': to,
                   'url_boton': edit_url}

        for i, obs in enumerate(observaciones.split('\n')):
            payload[f'observacion[{i}]'] = obs
        response = requests.post(
            BASE_URL + '/estatuto-invalido', data=payload)
        if response.status_code == 200:
            return True
    except requests.exceptions.RequestException as e:
        print(e)
    return False


def mail_fin_solicitud(nombre_sa, nombre_apoderado, destinatario):
    """
    Este metodo realiza el envio del mail de solicitud incorrecta (cuando es rechazada por mesa de entradas)
    """
    try:
        payload = {'nombre_sociedad': nombre_sa,
                   'nombre_apoderado': nombre_apoderado,
                   'destinatario': destinatario}
        response = requests.post(
            BASE_URL + '/fin-solicitud', data=payload)
        if response.status_code == 200:
            return True
    except requests.exceptions.RequestException as e:
        print(e)
    return False
