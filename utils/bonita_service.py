import requests
import json

from importlib import import_module

from django.conf import settings

SessionStore = import_module(settings.SESSION_ENGINE).SessionStore

# Creo el store de la sesion para guardar cookies y demas cosas
session_store = SessionStore()

# Por ahora, esto va a estar hardcodeado con el usuario de Bonita hasta proximas entregas


def bonita_login():
    """
    Este metodo realiza el login del usuario en la api de bonita
    """
    try:
        response = requests.post('http://localhost:8080/bonita/loginservice',
                                 data={'username': 'walter.bates', 'password': 'bpm'})
        session_store['jsessionid'] = response.cookies['JSESSIONID']
        session_store['bonita_api_token'] = response.cookies['X-Bonita-API-Token']
        return True
    except requests.exceptions.RequestException as e:
        print(e)
        return False


def bonita_api_call(resource,  method, url_params='', data={}):
    response = requests.request(method, url='http://localhost:8080/bonita/API/bpm/'+resource+url_params,
                                cookies={
                                    'JSESSIONID': session_store['jsessionid']
                                },
                                headers={
                                    'X-Bonita-API-Token': session_store['bonita_api_token']
                                },
                                data=json.dumps(data)
                                )
    if (int(str(response.status_code)[0]) == 4):
        raise requests.exceptions.RequestException(
            f'El request para recurso {resource} de bonita fallo con codigo {response.status_code}')
    return response.json() if resource != 'caseVariable' else True
