import requests
import environ

# # el objeto env se usa para traer las variables de entorno
env = environ.Env()
environ.Env.read_env()

BASE_URL = env('API_COMPLEMENTARIA_URL') + '/api/geo'


def get_all_continents():
    """
    Este metodo devuelve los codigos de todos los continentes
    """
    try:
        response = requests.get(BASE_URL + '/continente')
        if response.status_code == 200:
            return response.json()
    except requests.exceptions.RequestException as req_e:
        print(req_e)
    except requests.exceptions.ConnectionError as conn_e:
        print(conn_e)
    return False


def get_country_names_by_continent(ct_code):
    """
    Este metodo devuelve todos los paises pertenecientes a un continente por codigo
    """
    try:
        response = requests.get(BASE_URL + '/continente/' + ct_code + '/pais')
        if response.status_code == 200:
            response = response.json()
            return [country['name'] for country in response]
    except requests.exceptions.RequestException as req_e:
        print(req_e)
    except requests.exceptions.ConnectionError as conn_e:
        print(conn_e)
    return False
