from django.urls import path, include
from django.views.generic import TemplateView

from rest_framework.routers import DefaultRouter

from .views import BonitaViewSet, SocioViewSet, SociedadAnonimaViewSet, bonita_login, pendientes


# Create default router and add viewsets
router = DefaultRouter()
router.register(r'sociedad_anonima', SociedadAnonimaViewSet,
                basename='sociedad_anonima')
router.register(r'socio', SocioViewSet, basename='socio')
# router.register(r'bonita', BonitaViewSet, basename='bonita')

urlpatterns = [
    path('', include(router.urls)),
    path('login', TemplateView.as_view(
        template_name='login.html'), name="login"),
    # TODO refactorizar estos template views, pasarlos al ViewSet para simplificar estas urls
    path('sociedad_anonima/alta', TemplateView.as_view(
        template_name='altaDeFormulario.html'), name="alta_formulario"),
    path('sociedad_anonima/ver', TemplateView.as_view(
        template_name='verSociedadPublica.html'), name="ver_sociedad_publica"),
    path('sociedad_anonima/pendientes', pendientes,
         name="listado_sociedades_pendientes_aprobacion"),
    path('sociedad_anonima/a_estampillar', TemplateView.as_view(
        template_name='listadoDeSociedadesEstampillar.html'), name="listado_sociedades_estampillar"),
    path('sociedad_anonima/a_evaluar', TemplateView.as_view(
        template_name='listadoDeSociedadesEvaluacionEstatuto.html'), name="listado_sociedades_a_evaluar"),
    path('sociedad_anonima/verDetalle', TemplateView.as_view(
        template_name='verDetalleSociedad.html'), name="detalle_sociedad_anonima"),
    path('bonita/sociedades/obtener_por_task/<str:task_name>',
         BonitaViewSet.as_view({"get": "obtener_por_task"})),
    path('bonita/login', bonita_login, name='bonita_login'),
    path('bonita/logout',
         BonitaViewSet.as_view({"get": "bonita_logout"})),
    path('login', TemplateView.as_view(template_name='login.html'), name='login')
]
