import requests
import json

from importlib import import_module

from django.conf import settings

from .types import java_types

SessionStore = import_module(settings.SESSION_ENGINE).SessionStore

# Creo el store de la sesion para guardar cookies y demas cosas
session_store = SessionStore()

# Por ahora, esto va a estar hardcodeado con el usuario de Bonita hasta proximas entregas


def bonita_api_call(resource,  method, url_params='', data={}):
    """
    Esta funcion realiza un request HTTP al recurso de la API de bonita que se necesite.

    Params:
        * resource (str): El recurso al cual llamar, por ejemplo, "process", "case", etc.
        * method (str): El metodo HTTP a utilizar, por ejemplo, "get", "post", "put".
        * url_params? (str): Parametros adicionales de URL, o extension. Por ejemplo, "?id=1" o "/id/variable".
        * data? (dict): El body del request. Por ejemplo, { id: 1, name: "asd" }
    """
    try:
        response = requests.request(method, url='http://localhost:8080/bonita/API'+resource+url_params,
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
        json_response = response.json()
        return json_response
    except json.decoder.JSONDecodeError as json_e:
        print('La respuesta del servidor estaba vacia')
        return True
    except requests.exceptions.RequestException as req_e:
        print(req_e)
        return False


def bonita_login(user, password):
    """
    Este metodo realiza el login del usuario en la api de bonita
    """
    try:
        response = requests.post('http://localhost:8080/bonita/loginservice',
                                 data={'username': user, 'password': password})
        session_store['jsessionid'] = response.cookies['JSESSIONID']
        session_store['bonita_api_token'] = response.cookies['X-Bonita-API-Token']
        user_response = bonita_api_call(
            '/identity/user', 'get', '?f=enabled=true')
        session_store['bonita_user_id'] = [us['id']
                                           for us in user_response if us['userName'] == user][0]
        return True
    except requests.exceptions.RequestException as e:
        print(e)
        return False


def start_bonita_process(new_sa):
    """
    Este metodo dispara una instancia del proceso en bonita para una sociedad anonima dada.
    NOTA: hay que refactorizar el login y implementar manejo de excepciones.
    """
    try:
        # Por ahora, el login hardcodeado cada vez que se crea una SA
        bonita_login('Apoderado1', 'bpm')

        # Esto devuelve un array de procesos, en nuestro caso, uno solo, como Dict
        bonita_process = bonita_api_call(
            '/bpm/process', 'get', '?s=Proceso')[0]

        # Se arranca la instancia (caso) del proceso
        bonita_case = bonita_api_call('/bpm/case', 'post', data={
            "processDefinitionId": bonita_process['id']})

        # Se setean las variables id y name al caso
        bonita_api_call('/bpm/caseVariable', 'put', f'/{bonita_case["id"]}/id', {
            'type': java_types[type(new_sa.id).__name__], 'value': new_sa.id})

        bonita_api_call('/bpm/caseVariable', 'put', f'/{bonita_case["id"]}/name', {
            'type': java_types[type(new_sa.name).__name__], 'value': new_sa.name})

        # Esta parte no fue necesaria por ahora pero la dejo por si sirve para despues

        # Se mandan las variables una por una al proceso
        # for var, value in sa_vars:
        #     # Se deben ignorar las variables que no nos interesan
        #     # (hardcodeadas porque es mas facil y no van a cambiar)
        #     if (var not in ['id', '_state', 'comformation_statute', 'export_countries']):
        #         bonita_api_call('caseVariable', 'put', f'/{bonita_case["id"]}/{var}', {
        #             'type': java_types[type(value).__name__], 'value': value})

        return bonita_case
    except (requests.exceptions.RequestException, KeyError) as e:
        print(e)
        return None


def current_task_for_case(case_id):
    return bonita_api_call(
        '/bpm/activity', 'get', f'?p=0&c=10&f=caseId={case_id}')[0]


def assign_task(case_id):
    try:
        # Traigo task actual para el caso recibido
        current_task = current_task_for_case(case_id)

        # Asignar task al usuario logeado
        bonita_api_call('/bpm/humanTask/{}'.format(current_task['id']), 'put', '',
                        {'assigned_id': session_store['bonita_user_id']})
        return current_task['id']
    except requests.exceptions.RequestException as e:
        print(e)
        return None


def execute_task(task_id):
    try:
        # Asignar task al usuario logeado
        bonita_api_call('/bpm/userTask/{}/execution'.format(task_id), 'post')
        return True
    except requests.exceptions.RequestException as e:
        print(e)
        return False


def get_cases_for_task(task_name):
    """
    Este metodo devuelve un arreglo de case_id que esten "parados" en la tarea task_name (de tipo humanTask).

    Params:
        * task_name(str): nombre literal de tarea del modelo bonita. Por ejemplo: "Revisión de información"

    Returns:
        * list[int] | None
    """
    try:
        case_ids = []
        task_list = bonita_api_call(
            '/bpm/humanTask', 'get', f'?c=50&d=rootContainerId&o=displayName+ASC&p=0&f=displayName={task_name}')
        for task in task_list:
            case_ids.append(int(task['caseId']))
        return case_ids
    except requests.exceptions.RequestException as e:
        print(e)
        return None
