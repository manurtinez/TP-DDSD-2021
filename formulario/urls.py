from django.contrib import admin
from django.urls import path
from .views import altaDeFormulario, index

urlpatterns = [ 
    path('registroDeSociedad/Alta', altaDeFormulario,  name="altaDeFormulario"),
    path('', index)
]