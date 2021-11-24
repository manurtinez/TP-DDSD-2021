from django.shortcuts import redirect
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from formulario.models import SociedadAnonima
from services.bonita_service import (bonita_login_call,
                                     bonita_logout,
                                     get_cases_for_task, get_open_cases)
from services.bonita_statistics import area_statistics
from formulario.permissions import bonita_permission
from formulario.serializers import SociedadAnonimaRetrieveSerializer


class BonitaViewSet(viewsets.ViewSet):
    """
    Este viewset define todos los endpoints y actions necesarios para hacer operaciones con Bonita
    """
    # IMPORTANTE permito cualquiera y despues me fijo en cada view
    permission_classes = [permissions.AllowAny]
    # permission_classes = [BonitaPermission]
    # authentication_classes = [BonitaAuthentication]

    # url_path = r'obtener_por_task/(?P<task_name>\d+)'
    @action(detail=False)
    def obtener_por_task(self, request, *args, **kwargs):
        """
        Este endpoint devuelve una lista de sociedades que estan parados en task_name

        url params:
            * /<str:task_name>: nombre literal de tarea del modelo bonita. Por ejemplo: "Revisión de información"

        Returns:
            * list[int] | None
        """
        case_ids = get_cases_for_task(request.session, kwargs['task_name'])
        queryset = SociedadAnonima.objects.filter(case_id__in=case_ids)
        serializer = SociedadAnonimaRetrieveSerializer(queryset, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


@api_view(['post'])
def bonita_login(request):
    """
    Este endpoint maneja el login del sistema (es decir, el de bonita).

    Body:
        * user (str): nombre de usuario de bonita
        * password (str): contraseña de bonita del usuario
    """
    data = request.data
    response_code = bonita_login_call(request.session,
                                      data['user'], data['password'])
    if response_code == 204:
        print(request.session['bonita_role'])
        role = request.session['bonita_role']
        if role == 'Empleado mesa':
            return redirect('listado_sociedades_pendientes_aprobacion')
        elif role == 'Escribano':
            return redirect('listado_sociedades_a_evaluar')
        else:
            return redirect('index')
        # Agregar caso para el dashboard cuanto este el usuario admin
    elif response_code == 401:
        return Response(data="Las credenciales fueron incorrectas", status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(data="Hubo algun problema interno realizando el login", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view()
def logout(request):
    """
    Este endpoint hace logout al usuario que este logeado actualmente en el sistema (y bonita)
    """
    if bonita_logout():
        request.session.flush()
        return redirect('login')
    else:
        return Response(data='Hubo algun problema al hacer el logout.', status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view()
def estadisticas_por_area(request, *args, **kwargs):
    """
    Este endpoint devuelve las estadisticas (aprobados / rechazados) de parte de mesa de entradas o area legales.

    Url params:
        * /<str:area> (mesa | legales), por ejemplo, /estadisticas/por_area/mesa
    """
    if not bonita_permission(request, 'any'):
        # Se necesita estar logeado (con cualquier usuario) para acceder
        return Response(data='Necesita estar autenticado (con cualquier usuario) para usar este endpoint', status=status.HTTP_403_FORBIDDEN)
    area = kwargs['area']
    results = area_statistics(request.session, area)
    return Response(data=results, status=status.HTTP_200_OK)


@api_view()
def estadisticas_casos_abiertos(request):
    """
    Este endpoint devuelve cuantos casos se encuentran abiertos, es decir, sociedades que estan en proceso de aprobacion
    (que no llegaron al final del proceso), y cuantos se encuentran finalizados.

    Returns:
        * { "activos": int, "finalizados": int }
    """
    if not bonita_permission(request, 'any'):
        # Se necesita estar logeado (con cualquier usuario) para acceder
        return Response(data='Necesita estar autenticado (con cualquier usuario) para usar este endpoint', status=status.HTTP_403_FORBIDDEN)
    count = get_open_cases(request.session)
    return Response(data=count, status=status.HTTP_200_OK)
