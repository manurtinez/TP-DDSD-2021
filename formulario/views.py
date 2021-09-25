from django.shortcuts import render

# Create your views here.
def altaDeFormulario(request):
    return render(request, 'altaDeFormulario.html')

def index(request):
    return render(request, 'index.html')
