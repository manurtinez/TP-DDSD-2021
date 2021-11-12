import requests
import json
import environ
import traceback


from django.conf import settings

from .types import java_types

# # el objeto env se usa para traer las variables de entorno
env = environ.Env()
environ.Env.read_env()

# Por ahora, esto va a estar hardcodeado con el usuario de Bonita hasta proximas entregas

bonita_api_url = 'http://{}:8080/bonita/API'.format(env('BONITA_HOST'))
bonita_login_url = 'http://{}:8080/bonita/loginservice'.format(
    env('BONITA_HOST'))
bonita_logout_url = 'http://{}:8080/bonita/logoutservice'.format(
    env('BONITA_HOST'))


def bonita_api_call(session, resource,  method, url_params='', data={}):
    """
    Esta funcion realiza un request HTTP al recurso de la API de bonita que se necesite.

    Params:
        * resource (str): El recurso al cual llamar, por ejemplo, "process", "case", etc.
        * method (str): El metodo HTTP a utilizar, por ejemplo, "get", "post", "put".
        * url_params? (str): Parametros adicionales de URL, o extension. Por ejemplo, "?id=1" o "/id/variable".
        * data? (dict): El body del request. Por ejemplo, { id: 1, name: "asd" }
    """
    logged_user = session['logged_user']
    if not logged_user:
        print('Para hacer llamadas a api, debe autenticarse')
        return False
    try:
        response = requests.request(method, url=bonita_api_url+resource+url_params,
                                    cookies={
                                        'JSESSIONID': session['jsessionid']
                                    },
                                    headers={
                                        'X-Bonita-API-Token': session['bonita_api_token']
                                    },
                                    data=json.dumps(data)
                                    )
        if (int(str(response.status_code)[0]) == 4):
            raise requests.exceptions.RequestException(
                f'El request para recurso {resource} de bonita fallo con codigo {response.status_code}')
        json_response = response.json()
        return json_response
    except json.decoder.JSONDecodeError:
        print('La respuesta del servidor estaba vacia')
        return True
    except requests.exceptions.RequestException as req_e:
        print(
            'Error al llamar API de bonita para recurso {resource} -->', req_e)
        return False


def set_bonita_variable(session, case_id, var, var_value):
    """
    Este metodo setea una variable en un caso de bonita

    Params:
        * session: la sesion de django
        * case_id: el id del caso
        * var: NOMBRE de la variable (string)
        * var_value: VALOR de la variable
    """
    bonita_api_call(session, '/bpm/caseVariable', 'put', f'/{case_id}/{var}', {
        'type': java_types[type(var_value).__name__], 'value': var_value})


def bonita_login_call(session, user, password):
    """
    Este metodo realiza el login del usuario en la api de bonita

    Returns:
        * status_code (int): el codigo del response
    """
    try:
        response = requests.post(bonita_login_url,
                                 data={'username': user, 'password': password})
        if response.cookies:
            # Guardar en la sesion actual el nombre de usuario logeado, y sus cookies
            session['logged_user'] = user
            session['jsessionid'] = response.cookies['JSESSIONID']
            session['bonita_api_token'] = response.cookies['X-Bonita-API-Token']
            # Como necesitamos el id del usuario, y no es devuelto en el login, hacer otro request para obtenerlo,
            # y guardarlo en sesion
            user_response = bonita_api_call(session,
                                            '/identity/user', 'get', '?f=enabled=true')
            user_data = [
                us for us in user_response if us['userName'] == user][0]
            session['bonita_id'] = user_data['id']
            session['bonita_role'] = user_data['job_title']
    except (requests.exceptions.RequestException, ) as e:
        print(e)
        return 500
    except KeyError as e:
        print('KeyError: ' + str(e))
        return 500
    else:
        return response.status_code


def start_bonita_process(session, new_sa):
    """
    Este metodo dispara una instancia del proceso en bonita para una sociedad anonima dada.
    NOTA: hay que refactorizar el login y implementar manejo de excepciones.
    """
    try:
        # Por ahora, el login hardcodeado cada vez que se crea una SA
        bonita_login_call(session, 'Apoderado1', 'bpm')

        # Esto devuelve un array de procesos, en nuestro caso, uno solo, como Dict
        bonita_process = bonita_api_call(session,
                                         '/bpm/process', 'get', '?s=Proceso')[0]

        # Se arranca la instancia (caso) del proceso
        bonita_case = bonita_api_call(session, '/bpm/case', 'post', data={
            "processDefinitionId": bonita_process['id']})

        # Se setean las variables id y name al caso
        set_bonita_variable(session, bonita_case['id'], 'id', new_sa.id)
        set_bonita_variable(session, bonita_case['id'], 'name', new_sa.name)

        # bonita_api_call(session, '/bpm/caseVariable', 'put', f'/{bonita_case["id"]}/id', {
        #     'type': java_types[type(new_sa.id).__name__], 'value': new_sa.id})

        # bonita_api_call(session, '/bpm/caseVariable', 'put', f'/{bonita_case["id"]}/name', {
        #     'type': java_types[type(new_sa.name).__name__], 'value': new_sa.name})

        # Esta parte no fue necesaria por ahora pero la dejo por si sirve para despues

        # Se mandan las variables una por una al proceso
        # for var, value in sa_vars:
        #     # Se deben ignorar las variables que no nos interesan
        #     # (hardcodeadas porque es mas facil y no van a cambiar)
        #     if (var not in ['id', '_state', 'comformation_statute', 'export_countries']):
        #         bonita_api_call('caseVariable', 'put', f'/{bonita_case["id"]}/{var}', {
        #             'type': java_types[type(value).__name__], 'value': value})

        return bonita_case
    except (requests.exceptions.RequestException, KeyError):
        print('Error al iniciar proceso de bonita --> ', traceback.format_exc())
        return None


def current_task_for_case(session, case_id):
    return bonita_api_call(session,
                           '/bpm/activity', 'get', f'?p=0&c=10&f=caseId={case_id}')[0]


def assign_task(session, case_id):
    try:
        # Traigo task actual para el caso recibido
        current_task = current_task_for_case(session, case_id)

        # Asignar task al usuario logeado
        bonita_api_call(session, '/bpm/humanTask/{}'.format(current_task['id']), 'put', '',
                        {'assigned_id': session['bonita_id']})
        return current_task['id']
    except requests.exceptions.RequestException as e:
        print(e)
        return None


def execute_task(session, task_id):
    try:
        # Asignar task al usuario logeado
        bonita_api_call(
            session, '/bpm/userTask/{}/execution'.format(task_id), 'post')
        return True
    except requests.exceptions.RequestException as e:
        print(e)
        return False


def get_cases_for_task(session, task_name):
    """
    Este metodo devuelve un arreglo de case_id que esten "parados" en la tarea task_name (de tipo humanTask).
    Estos luego pueden ser usados para traer las SA correspondientes de la DB.

    Params:
        * task_name(str): nombre literal de tarea del modelo bonita. Por ejemplo: "Revisión de información"

    Returns:
        * list[int] | None
    """
    try:
        case_ids = []
        task_list = bonita_api_call(session,
                                    '/bpm/humanTask', 'get', f'?c=50&d=rootContainerId&o=displayName+ASC&p=0&f=displayName={task_name}')
        for task in task_list:
            case_ids.append(int(task['caseId']))
        return case_ids
    except requests.exceptions.RequestException as e:
        print(e)
        return None


def bonita_logout():
    try:
        requests.get(bonita_logout_url)
        return True
    except requests.exceptions.RequestException as e:
        print(e)
        return False
