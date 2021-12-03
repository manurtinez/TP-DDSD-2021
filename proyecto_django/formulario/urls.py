from django.urls import include, path
from rest_framework.routers import DefaultRouter

from formulario.views.bonita import (BonitaViewSet, bonita_login, estadistica_promedio_resolucion,
                                     estadisticas_casos_abiertos,
                                     estadisticas_por_area,
                                     estadisticas_usuario, logout)
from formulario.views.sa import SociedadAnonimaViewSet
from formulario.views.socios import SocioViewSet
from formulario.views.templates import (a_evaluar_estatuto, alta_sa, dashboard,
                                        login_template, pendientes,
                                        ver_sa_publica, editar_estatuto, editar_sa)
from formulario.views.export_views import top_continent, top_country_languages, top_export_states

# Create default router and add viewsets
router = DefaultRouter()
router.register(r'sociedad_anonima', SociedadAnonimaViewSet,
                basename='sociedad_anonima')
router.register(r'socio', SocioViewSet, basename='socio')
# router.register(r'bonita', BonitaViewSet, basename='bonita')

urlpatterns = [
    path('', include(router.urls)),
    # TODO refactorizar estos template views, pasarlos al ViewSet para simplificar estas urls
    path('sociedad_anonima/alta', alta_sa, name="alta_formulario"),
    path('sociedad_anonima/estatuto/editar',
         editar_estatuto, name="editar_estatuto"),
    path('sociedad_anonima/editar', editar_sa, name="editar_sa"),
    path('sociedad_anonima/ver/<str:hash>',
         ver_sa_publica, name="ver_sociedad_publica"),
    path('sociedad_anonima/pendientes', pendientes,
         name="listado_sociedades_pendientes_aprobacion"),
    path('sociedad_anonima/a_evaluar', a_evaluar_estatuto,
         name="listado_sociedades_a_evaluar"),
    path('dashboard', dashboard, name="dashboard"),
    path('bonita/sociedades/obtener_por_task/<str:task_name>',
         BonitaViewSet.as_view({"get": "obtener_por_task"})),
    path('bonita/login', bonita_login, name='bonita_login'),
    path('bonita/logout',
         logout, name='logout'),
    path('login', login_template, name='login'),
    path('estadisticas/por_area/<str:area>', estadisticas_por_area),
    path('estadisticas/sociedades_en_proceso/', estadisticas_casos_abiertos),
    path('estadisticas/usuarios/<str:condicion>', estadisticas_usuario),
    path('estadisticas/promedio_resolucion/', estadistica_promedio_resolucion),
    path('estadisticas_exp/top_continente/', top_continent),
    path('estadisticas_exp/top_paises_lenguajes/', top_country_languages),
    path('estadisticas_exp/top_estados/<int:limit>', top_export_states),
]
