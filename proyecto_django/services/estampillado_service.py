import requests
import json
import environ

from importlib import import_module

from django.conf import settings

from services.types import JWTException

# # el objeto env se usa para traer las variables de entorno
env = environ.Env()
environ.Env.read_env()

SessionStore = import_module(settings.SESSION_ENGINE).SessionStore

# Creo el store de la sesion para guardar cookies y demas cosas
session_store = SessionStore()

# Variables POR AHORA hardcodeadas
username = 'escribano'
password = '1234'


def register_user(username, password, email):
    """
    Registrar un nuevo usuario en la API de estampillado
    """
    try:
        response = requests.post(env('API_ESTAMPILLADO_URL')+'/register',
                                 data={'username': username, 'password': password, 'email': email})
        response.raise_for_status()
        return True
    except (requests.exceptions.RequestException, requests.exceptions.HTTPError) as e:
        print(e)
        return False


# POR AHORA, esto no recibe parametros, siempre autoriza al mismo usuario
def obtain_token():
    """
    Obtener token JWT para un determinado user y guardarlo en sesion
    """
    # Si el token ya existe, directamente devolverlo
    try:
        token = session_store['estampillado_'+username+'_jwt']
        return token
    # El token no estaba
    except KeyError as e:
        try:
            data = json.dumps({
                'username': username, 'password': password})
            headers = {
                "Content-Type": 'application/json'
            }
            response = requests.post(
                env('API_ESTAMPILLADO_URL')+'/api/login_check', headers=headers, data=data)
            response.raise_for_status()
            json_response = response.json()
            session_store['estampillado_'+username +
                          '_jwt'] = json_response['token']
            return json_response['token']
        except (requests.exceptions.RequestException, requests.exceptions.HTTPError) as e:
            print(e)


def estampillado_api_call(method, endpoint, data, url_params):
    headers = {
        'Authorization': f'Bearer {obtain_token()}'
    }
    response = requests.request(method, url=env('API_ESTAMPILLADO_URL')+endpoint+url_params,
                                data=json.dumps(data), headers=headers
                                )
    # Hubo algun problema con el JWT
    if response.status_code == 401:
        raise JWTException('Problema con JWT')
    return response.json()


def complementaria_api_call(method, endpoint, data={}, url_params=''):
    response = requests.request(method, url=env('API_COMPLEMENTARIA_URL')+endpoint+url_params,
                                data=data
                                )
    return response.json()


def api_call_with_retry(method, endpoint, data={}, url_params=''):
    """
    Esta funcion realiza un request HTTP al recurso de la API de estampillado que se necesite.
    Tiene consideracion de error de JWT.

    Params:
        * endpoint (str): El endpoint al cual llamar, por ejemplo, 'api/estampillado/
        * method (str): El metodo HTTP a utilizar, por ejemplo, "get", "post", "put".
        * url_params? (str): Parametros adicionales de URL, o extension. Por ejemplo, "?id=1" o "/id/variable".
        * data? (dict): El body del request. Por ejemplo, { id: 1, name: "asd" }
    """
    try:
        return estampillado_api_call(
            method, endpoint, data, url_params)
    except JWTException as e:
        # Si hubo un problema con el JWT, borrarlo, obtener nuevo y reintentar
        del session_store['estampillado_'+username+'_jwt']
        obtain_token()
        return estampillado_api_call(method, endpoint, data, url_params)
    except (requests.exceptions.RequestException, requests.exceptions.HTTPError) as e:
        # Hubo algun otro problema
        print(e)
