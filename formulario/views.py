from django.shortcuts import redirect, render
from rest_framework import status, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from formulario.models import Socio, SociedadAnonima
from formulario.serializers import SociedadAnonimaSerializer, SocioSerializer


# Create your views here.

# IMPORTANTE por ahora esta API esta abierta, sin embargo cuando llegue el momento va a tener que autenticarse para
# accederla

@api_view(['GET', 'POST'])
@permission_classes((permissions.AllowAny,))
def alta_formulario(request):
    # Si es get, devolver el template
    if request.method == 'GET':
        # Aca se podrian pre-cargar los campos en caso de que sea una correccion de datos
        return render(request, 'altaDeFormulario.html')
    elif request.method == 'POST':
        serializer = SociedadAnonimaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return redirect('/')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # form = request.POST
        # # Si el representante legal ya existe, traerlo, sino, crearlo
        # # !! Por ahora el porcentaje esta hardcodeado hasta que este el array de socios del front

        # # Se crea la nueva sociedad anonima con los datos
        # nueva_sociedad = SociedadAnonima()
        # nueva_sociedad.name = form['nombre']
        # nueva_sociedad.legal_domicile = form['domicilioLegal']
        # nueva_sociedad.real_domicile = form['domicilioReal']
        # nueva_sociedad.legal_representative = representante
        # nueva_sociedad.export_countries = list(form['paisDeExportacion'])
        # nueva_sociedad.save()

        # # Agregar socios aca
        # nueva_sociedad.partners.add(representante)
        # Redirection a siguiente pagina correspondiente
        # return redirect('/')


class SocioViewSet(viewsets.ModelViewSet):
    """
    Este ViewSet provee acciones `list`, `create`, `retrieve`,
    `update` and `destroy` para el modelo Socio.
    """
    queryset = Socio.objects.all()
    serializer_class = SocioSerializer
    permission_classes = [permissions.AllowAny]  # IMPORTANTE cambiar esto cuando haya autenticacion

    def perform_create(self, serializer):
        serializer.save()


class SociedadAnonimaViewSet(viewsets.ModelViewSet):
    """
    Este ViewSet provee acciones `list`, `create`, `retrieve`,
    `update` and `destroy` para el modelo SociedadAnonima.
    """
    queryset = SociedadAnonima.objects.all()
    serializer_class = SociedadAnonimaSerializer
    permission_classes = [permissions.AllowAny]  # IMPORTANTE cambiar esto cuando haya autenticacion


@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def index(request):
    return render(request, 'index.html')
