from django.urls import path

from .views import alta_formulario, index, SocioViewSet, SociedadAnonimaViewSet

urlpatterns = [
    path('sociedad-anonima/alta', alta_formulario, name="altaDeFormulario"),
    path('sociedad-anonima/sa', SociedadAnonimaViewSet.as_view({'get': 'list'})),
    path('sociedad-anonima/socio', SocioViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('', index)
]
