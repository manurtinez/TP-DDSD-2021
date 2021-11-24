
from formulario.permissions import template_guard


def pendientes(request):
    return template_guard(request, 'listadoDeSociedadesPendientes.html', 'Empleado mesa')
