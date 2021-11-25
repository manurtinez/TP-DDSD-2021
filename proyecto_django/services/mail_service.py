import requests

BASE_URL = 'http://localhost/api/email/send'


def mail_solicitud_incorrecta(nombre_sa, nombre_apoderado, destinatario, plazo):
    """
    Este metodo realiza el envio del mail de solicitud incorrecta (cuando es rechazada por mesa de entradas)
    """
    try:
        payload = {'nombre_sociedad': nombre_sa,
                   'nombre_apoderado': nombre_apoderado,
                   'destinatario': destinatario,
                   'plazo_correccion': plazo}
        response = requests.post(
            BASE_URL + '/informacion-sociedad-incorrecta', data=payload)
        if response.status_code == 200:
            return True
    except requests.exceptions.RequestException as e:
        print(e)
    return False


def mail_num_expediente(nombre_sa, nombre_apoderado, destinatario, num_expediente):
    """
    Este metodo realiza el envio del mail de solicitud incorrecta (cuando es rechazada por mesa de entradas)
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


def mail_estatuto_invalido(nombre_sa, nombre_apoderado, destinatario, observaciones):
    """
    Este metodo realiza el envio del mail de solicitud incorrecta (cuando es rechazada por mesa de entradas)
    """
    try:
        payload = {'nombre_sociedad': nombre_sa,
                   'nombre_apoderado': nombre_apoderado,
                   'destinatario': destinatario}
        obs_array = []
        for i, obs in enumerate(observaciones.split(';')):
            # print(i)
            payload[f'observacion[{i}]'] = obs
            # obs_array.append(obs)
        # payload['observacion'] = obs_array
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
