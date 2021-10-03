from django.urls import path
from django.views.generic import TemplateView

from .views import SocioViewSet, SociedadAnonimaViewSet

urlpatterns = [
    path('sociedad-anonima/alta', TemplateView.as_view(
        template_name='altaDeFormulario.html'), name="alta_formulario"),
    path('sociedad-anonima/sa',
         SociedadAnonimaViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('sociedad-anonima/socio',
         SocioViewSet.as_view({'get': 'list', 'post': 'create'}))
]
