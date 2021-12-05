from django.db.models import Count
from django.db.models.expressions import F, Func
from formulario.models import Exportacion
from rest_framework.decorators import api_view
from rest_framework.response import Response

from services.geo_service import get_all_continents, get_country_names_by_continent


@api_view()
def top_continent(request):
    """
    Este metodo devuelve, dentro de las exportaciones, el continente que recibe exportaciones de mas sociedades.
    EXCLUYENDO AMERICA (esto puede cambiarse, era el ejemplo)
    """
    # Excluyo america (norte y sur)
    queryset = Exportacion.objects.exclude(
        continent_code='SA').exclude(continent_code='NA')

    # Hago agregacion de count de sa_id, agrupada por continent
    queryset = queryset.annotate(
        continent_count=Count('sa_id', distinct=True), code=F(
            'continent_code'), name=F('continent_name')).order_by('-continent_count')

    # Agarro el primero
    continent = queryset.values('code', 'name').first()

    # Devuelvo el primero (mas cantidad)
    return Response(data=continent if continent else {})


@api_view()
def top_country_languages(request, limit):
    """
    Este metodo devuelve los lenguajes de los paises a donde mas sociedades exportan.
    """
    queryset = Exportacion.objects.all()

    # Agregacion para ordenar exportaciones por ocurrencia de paises descendente
    # Se agarran los primeros n (limit)
    queryset = queryset.values('country_id').annotate(country_count=Count(
        'country_id')).order_by('-country_count')[:limit]

    # Armo lista con codigo y lenguaje de c/u paises del top
    result_list = queryset.all().values('country__code', 'country__languages')
    return Response(data=result_list)


@api_view()
def top_export_states(request, limit):
    """
    Este endpoint devuelve los estados en donde se registran mas sociedades.

    Params:
        * limit (int): Cuantos estados devolver (por defecto 3)
    """
    # TODO Esto puede causar un problema de memoria si hay muchisimos estados. Mejorar para hacer todo directo en la query

    # Traigo una lista de los estados
    queryset = Exportacion.objects.annotate(states_arr=Func(F('states'), function='unnest')
                                            ).values_list('states_arr', flat=True)

    # Transformo queryset a lista
    state_list = list(queryset)

    # Ordeno la lista por cantidad de ocurrencias
    state_list = sorted(set(state_list), key=state_list.count, reverse=True)

    # Retorno la lista hasta el limite
    return Response(data=state_list[:limit])


@api_view()
def not_exported_continents(request):
    """
    Este endpoint devuelve los continentes Y PAISES a los que actualmente no esta exportando ninguna sociedad
    """
    # Traigo el total de continentes
    all_continents = get_all_continents()

    # Traigo la lista de continentes de la DB
    db_continents = list(Exportacion.objects.all().annotate(code=F(
        'continent_code'), name=F('continent_name')).values('code', 'name').distinct())

    # Saco la lista diferencia
    result_continents = [
        cont for cont in all_continents if cont not in db_continents]

    results = {}

    # Para cada codigo, traigo los paises y armo el response
    for ct in result_continents:
        # Pido a la API de paises los de ese continente
        results[ct['name']] = get_country_names_by_continent(ct['code'])

    # Devuelvo la diferencia entre todos los continentes y los de la db
    return Response(data=results)
