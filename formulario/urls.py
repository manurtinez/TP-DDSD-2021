from django.urls import path, include
from django.views.generic import TemplateView

from rest_framework.routers import DefaultRouter

from .views import SocioViewSet, SociedadAnonimaViewSet


# Create default router and add viewsets
router = DefaultRouter()
router.register(r'sociedad-anonima', SociedadAnonimaViewSet,
                basename='sociedad-anonima')
router.register(r'socio', SocioViewSet, basename='socio')

urlpatterns = [
    path('', include(router.urls)),
    path('sociedad-anonima/alta', TemplateView.as_view(
        template_name='altaDeFormulario.html'), name="alta_formulario")
]
