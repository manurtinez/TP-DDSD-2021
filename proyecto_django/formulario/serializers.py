from django.contrib.auth.models import User, Group
from rest_framework import serializers

from .models import Pais, SociedadAnonima, Socio, SocioSA


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class SocioSerializer(serializers.ModelSerializer):
    """
    Este serializer corresponde a la clase Socio
    """
    class Meta:
        model = Socio
        fields = '__all__'


class SocioSASerializer(serializers.ModelSerializer):
    """
    Este serializer corresponde a la clase (join table) SocioSA
    """
    class Meta:
        model = SocioSA
        fields = '__all__'


class SocioPercentageSerializer(serializers.Serializer):
    """
    Este serializer sirve para recibir una tupla de id y porcentaje por cada socio al cargar una sociedad anonima
    """
    id = serializers.PrimaryKeyRelatedField(queryset=Socio.objects.all())
    percentage = serializers.IntegerField()
    is_representative = serializers.BooleanField(default=False)


class LenguajeSerializer(serializers.Serializer):
    """
    Este serializer corresponde al modelo Lenguaje
    """
    code = serializers.CharField(max_length=3)
    name = serializers.CharField(max_length=20)
    native = serializers.CharField(max_length=50)


class PaisSerializer(serializers.Serializer):
    """
    Este serializer corresponde a la estructura esperada para cada pais dentro de un continente
    """
    languages = LenguajeSerializer(many=True)
    states = serializers.ListField()
    name = serializers.CharField(max_length=60)
    code = serializers.CharField(max_length=4)

    class Meta:
        model = Pais
        fields = '__all__'


class ContinenteSerializer(serializers.Serializer):
    """
    Este serializer corresponde a la estructura esperada para cada continente.
    """
    code = serializers.CharField(max_length=3)
    name = serializers.CharField(max_length=15)
    countries = PaisSerializer(many=True)


class SociedadAnonimaSerializer(serializers.ModelSerializer):
    """
    Este serializer corresponde a la clase SociedadAnonima (para el create)
    """
    comformation_statute = serializers.FileField(required=False)
    partners = SocioPercentageSerializer(many=True)
    stamp_hash = serializers.CharField(required=False)
    exports = ContinenteSerializer(many=True)

    class Meta:
        model = SociedadAnonima
        fields = ['name', 'legal_domicile', 'real_domicile',
                  'creation_date',
                  'representative_email', 'comformation_statute', 'partners', 'stamp_hash', 'case_id', 'exports']


class SociedadAnonimaRetrieveSerializer(serializers.ModelSerializer):
    """
    Este serializer corresponde a la clase SociedadAnonima (para el get). Parsea correctamente el array de partners
    """
    comformation_statute = serializers.FileField(required=False)
    # ! El nombre de este campo va a ser mejorado con el codigo comentado de abajo
    sociosa_set = SocioSASerializer(many=True)

    class Meta:
        model = SociedadAnonima
        fields = ['name',
                  'real_domicile',
                  'legal_domicile',
                  'creation_date',
                  'comformation_statute',
                  'representative_email',
                  'sociosa_set', 'id',
                  'stamp_hash',
                  'case_id',
                  'numero_expediente',
                  'drive_folder_link']

    #     def get_partners(self, obj):
    #     return SocioSASerializer(instance=obj.sociosa_set.all(), many=True)
    # partners = serializers.SerializerMethodField()
