from django.db.models import Count
from django.db.models.expressions import F, Func
from formulario.models import Exportacion
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view()
def top_continent(request):
    """
    Este metodo devuelve, dentro de las exportaciones, el continente que recibe exportaciones de mas sociedades.
    EXCLUYENDO AMERICA (esto puede cambiarse, era el ejemplo)
    """
    # Excluyo america (norte y sur)
    queryset = Exportacion.objects.exclude(
        continent='SA').exclude(continent='NA')

    # Hago agregacion de count de sa_id, agrupada por continent
    queryset = queryset.values('continent').annotate(
        continent_count=Count('sa_id', distinct=True)).order_by('-continent_count')

    # Agarro el primero
    continent = queryset.first()

    # Devuelvo el primero (mas cantidad)
    return Response(data=continent if continent else {})


@api_view()
def top_country_languages(request):
    """
    Este metodo devuelve los lenguajes de los paises a donde mas sociedades exportan.
    """
    queryset = Exportacion.objects.all()

    # Agregacion para ordenar exportaciones por ocurrencia de paises descendente
    queryset = queryset.annotate(country_count=Count(
        'country_id')).order_by('-country_count')

    # Agarro el primero
    country = queryset.first().country

    # Retorno los lenguajes del primer pais
    return Response(data=country.languages if country else [])


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
