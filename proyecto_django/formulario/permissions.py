from django.shortcuts import render, redirect
from django.contrib import messages


def template_guard(request, url, role):
    """
    Esta funcion chequea el rol del usuario autenticado en el sistema (o si acaso existe).
    En el caso que sea el correcto, deja pasar a la url dada.
    Caso contrario, redirige al login pidiendo autenticar de nuevo.

    Params:
        * request: el objeto request de django
        * url: la url a la que se esta queriendo acceder
        * permission: el rol que se debe tener para accederla, por ejemplo, "Empleado mesa" o "Escribano".
            Este se corresponde con el rol del usuario de bonita
    """
    if 'bonita_role' not in request.session or request.session['bonita_role'] != role:
        # TODO esto de aca abajo iria en el authenticate, NO en el permissions
        # messages.error(request,
        #                'Debe autenticarse de nuevo.')
        # return redirect('login')
        messages.warning(
            request, 'Usted no tiene permisos para acceder a la pagina solicitada.')
        return redirect('index')
    else:
        return render(request, url)


def bonita_permission(request, role):
    if role == 'any':
        return 'bonita_role' in request.session
    else:
        return 'bonita_role' in request.session and request.session['bonita_role'] == role
