import requests
import json
import environ

from importlib import import_module

from django.conf import settings

# # el objeto env se usa para traer las variables de entorno
env = environ.Env()
environ.Env.read_env()

SessionStore = import_module(settings.SESSION_ENGINE).SessionStore

# Creo el store de la sesion para guardar cookies y demas cosas
session_store = SessionStore()


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
    username = 'escribano'
    password = '1234'
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


# Por ahora, el hash va a estar HARDCODEADO, siempre devuelve mismo QR
# TODO para proximas entregas, se va a implementar el resto del servicio
def obtain_by_hash():
    hash = '89ff31470d00b95eaf0895fd95f5d321'
    headers = {
        'Authorization': f'Bearer {obtain_token()}'
    }
    try:
        response = requests.get(
            env('API_ESTAMPILLADO_URL')+'/api/estampillado/'+hash, headers=headers)
        response.raise_for_status()
        json_response = response.json()
        return json_response
    except (requests.exceptions.RequestException, requests.exceptions.HTTPError) as e:
        print(e)
