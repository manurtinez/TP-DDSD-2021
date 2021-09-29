from django.contrib import admin
from django.urls import path
from .views import altaDeFormulario, index

urlpatterns = [
    path('sociedad-anonima/alta', altaDeFormulario,  name="altaDeFormulario"),
    path('', index)
]
