
from django.shortcuts import render
from formulario.permissions import template_guard


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


def editar_sa(request):
    return render(request, 'editarFormulario.html')


def editar_estatuto(request):
    return render(request, 'editarEstatuto.html')
