from formulario.models import Exportacion
from django.db.models import Count


def top_export_continent():
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

    # Devuelvo el primero (mas cantidad)
    return queryset.first()
