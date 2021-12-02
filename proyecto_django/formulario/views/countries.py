from rest_framework.decorators import api_view
from rest_framework.response import Response
from utils.country_statistics import top_export_continent


@api_view()
def top_continente(request):
    continent = top_export_continent()
    return Response(data=continent if continent else {})
