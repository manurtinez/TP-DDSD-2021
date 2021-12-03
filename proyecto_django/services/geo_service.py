import requests
import environ

# # el objeto env se usa para traer las variables de entorno
env = environ.Env()
environ.Env.read_env()

BASE_URL = env('API_COMPLEMENTARIA_URL') + '/api/geo'


def get_all_continent_codes():
    """
    Este metodo devuelve los codigos de todos los continentes
    """
    try:
        response = requests.get(BASE_URL + '/continente')
        if response.status_code == 200:
            response = response.json()
            return [cont['code'] for cont in response]
    except requests.exceptions.RequestException as req_e:
        print(req_e)
    except requests.exceptions.ConnectionError as conn_e:
        print(conn_e)
    return False
