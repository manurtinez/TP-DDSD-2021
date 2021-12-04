
from django.contrib import messages
from django.shortcuts import redirect, render
from formulario.permissions import template_guard
from formulario.models import SAHashes, SociedadAnonima


def pendientes(request):
    return template_guard(request, 'listadoDeSociedadesPendientes.html', 'Empleado mesa')


def a_evaluar_estatuto(request):
    return template_guard(request, 'listadoDeSociedadesEvaluacionEstatuto.html', 'Escribano')


def dashboard(request):
    return template_guard(request, 'dashboard.html', 'Direccion')


def login_template(request):
    return render(request, 'login.html')


def ver_sa_publica(request, hash):
    return render(request, 'verSociedadPublica.html')


def alta_sa(request):
    return render(request, 'altaDeFormulario.html')


def editar_sa(request, id, hash):
    try:
        db_hash = SAHashes.objects.get(sa_id=id).hash
    except SAHashes.DoesNotExist:
        messages.error(
            request, 'No habia ninguna sociedad creada con el id dado.')
        return redirect('index')
    if db_hash != hash:
        messages.error(
            request, 'El hash proporcionado en la URL fue incorrecto')
        return redirect('index')
    sa = SociedadAnonima.objects.get(pk=id)
    return render(request, 'editarSociedad.html', {'sociedad': sa})


def editar_estatuto(request, id):
    try:
        sa = SociedadAnonima.objects.get(pk=id)
    except SociedadAnonima.DoesNotExist:
        messages.error(
            request, 'No habia ninguna sociedad creada con el id dado.')
        return redirect('index')
    return render(request, 'editarEstatuto.html', {'sociedad': sa})
