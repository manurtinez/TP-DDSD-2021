from django.urls import path, include
from django.views.generic import TemplateView

from rest_framework.routers import DefaultRouter

from .views import SocioViewSet, SociedadAnonimaViewSet


# Create default router and add viewsets
router = DefaultRouter()
router.register(r'sociedad_anonima', SociedadAnonimaViewSet,
                basename='sociedad_anonima')
router.register(r'socio', SocioViewSet, basename='socio')

urlpatterns = [
    path('', include(router.urls)),
    path('sociedad_anonima/alta', TemplateView.as_view(
        template_name='altaDeFormulario.html'), name="alta_formulario"), 
    path('sociedad_anonima/ver', TemplateView.as_view(
        template_name='verSociedadPublica.html'), name="ver_sociedad_publica"),
    path('sociedad_anonima/listadoDeSociedadesPendientes', TemplateView.as_view(
        template_name='listadoDeSociedadesPendientes.html'), name="listado_sociedades_pendientes_aprobacion"),
    path('sociedad_anonima/listadoDeSociedadesEstampillar', TemplateView.as_view(
        template_name='listadoDeSociedadesEstampillar.html'), name="listado_sociedades_estampillar"),
    path('sociedad_anonima/verDetalle', TemplateView.as_view(
        template_name='verDetalleSociedad.html'), name="detalle_sociedad_anonima"),
]
