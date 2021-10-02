from django.shortcuts import redirect, render
from rest_framework import status, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from formulario.models import Socio, SociedadAnonima
from formulario.serializers import SociedadAnonimaRetrieveSerializer, SociedadAnonimaSerializer, SocioSerializer

import json

# IMPORTANTE por ahora esta API esta abierta, sin embargo cuando llegue el momento va a tener que autenticarse para
# accederla

# Create your views here.


@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def index(request):
    return render(request, 'index.html')


@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def alta_formulario(request):
    return render(request, 'altaDeFormulario.html')


class SocioViewSet(viewsets.ModelViewSet):
    """
    Este ViewSet provee acciones `list`, `create`, `retrieve`,
    `update` and `destroy` para el modelo Socio.
    """
    serializer_class = SocioSerializer
    # IMPORTANTE cambiar esto cuando haya autenticacion
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Se puede pasar un URL param "dni" para obtener el socio con ese dni (si existe).
        Si no se pasa nada, retorna todos los socios.
        """
        queryset = Socio.objects.all()
        dni = self.request.query_params.get('dni')
        if dni is not None:
            queryset = queryset.filter(dni=dni)
        return queryset


class SociedadAnonimaViewSet(viewsets.ModelViewSet):
    """
    Este ViewSet provee acciones `list`, `create`, `retrieve`,
    `update` and `destroy` para el modelo SociedadAnonima.
    """
    queryset = SociedadAnonima.objects.all()
    serializer_class = SociedadAnonimaSerializer
    # IMPORTANTE cambiar esto cuando haya autenticacion
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        """
        Este metodo define la creacion de los objetos Sociedad Anonima
        """
        data = request.data

        # Se crea la nueva SA y se guarda
        new_sa = SociedadAnonima.objects.create(name=data['name'], legal_domicile=data['legal_domicile'],
                                                real_domicile=data['real_domicile'], export_countries=data['export_countries'])
        new_sa.save()

        serializer = SociedadAnonimaSerializer(data=request.data)
        if serializer.is_valid():
            # Se agregan los socios que hayan venido
            partners = data['partners']
            for socio in partners:
                partner = Socio.objects.get(pk=socio['id'])
                # !! Por ahora el porcentaje esta hardcodeado hasta que este el array de socios del front
                new_sa.partners.add(
                    partner, through_defaults={'percentage': socio['percentage']})
            return redirect('/')
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_serializer_class(self):
        if self.action == 'create':
            return SociedadAnonimaSerializer
        else:
            return SociedadAnonimaRetrieveSerializer
