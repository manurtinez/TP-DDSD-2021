# Este dict mapea tipos de python a tipos de Java para comunicar con API de bonita
java_types = {
    'str': 'java.lang.String',
    'int': 'java.lang.Integer',
    'float': 'java.lang.Double',
    'bool': 'java.lang.Boolean',
    'datetime.date': 'java.lang.Date'  # Hmmmm
}


class JWTException(Exception):
    """
    Esta simple excepcion es para saber cuando hubo un error de JWT y actuar en consecuencia
    """
    pass


class BonitaNotOpenException(Exception):
    """
    Uso esta excepcion para determinar que el fallo fue debido a que el server de bonita no esta corriendo o no se encuentra disponible
    """
    pass
