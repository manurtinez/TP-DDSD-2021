import requests
import json

from importlib import import_module

from django.conf import settings

from .types import java_types

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
    """
    Esta funcion realiza un request HTTP al recurso de la API de bonita que se necesite.

    Params:
        * resource (str): El recurso al cual llamar, por ejemplo, "process", "case", etc.
        * method (str): El metodo HTTP a utilizar, por ejemplo, "get", "post", "put".
        * url_params? (str): Parametros adicionales de URL, o extension. Por ejemplo, "?id=1" o "/id/variable".
        * data? (dict): El body del request. Por ejemplo, { id: 1, name: "asd" }
    """
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


def start_bonita_process(new_sa):
    """
    Este metodo dispara una instancia del proceso en bonita para una sociedad anonima dada.
    NOTA: hay que refactorizar el login y implementar manejo de excepciones.
    """
    try:
        # Por ahora, el login hardcodeado cada vez que se crea una SA
        bonita_login()

        # Esto devuelve un array de procesos, en nuestro caso, uno solo, como Dict
        bonita_process = bonita_api_call('process', 'get', '?s=Proceso')[0]

        # Se arranca la instancia (caso) del proceso
        bonita_case = bonita_api_call('case', 'post', data={
            "processDefinitionId": bonita_process['id']})

        # Se setean las variables id y name al caso
        bonita_api_call('caseVariable', 'put', f'/{bonita_case["id"]}/id', {
            'type': java_types[type(new_sa.id).__name__], 'value': new_sa.id})

        bonita_api_call('caseVariable', 'put', f'/{bonita_case["id"]}/name', {
            'type': java_types[type(new_sa.name).__name__], 'value': new_sa.name})

        # Esta parte no fue necesaria por ahora pero la dejo por si sirve para despues

        # Se mandan las variables una por una al proceso
        # for var, value in sa_vars:
        #     # Se deben ignorar las variables que no nos interesan
        #     # (hardcodeadas porque es mas facil y no van a cambiar)
        #     if (var not in ['id', '_state', 'comformation_statute', 'export_countries']):
        #         bonita_api_call('caseVariable', 'put', f'/{bonita_case["id"]}/{var}', {
        #             'type': java_types[type(value).__name__], 'value': value})

        return True
    except requests.exceptions.RequestException as e:
        print(e)
        return False
