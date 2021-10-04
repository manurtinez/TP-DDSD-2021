from django.contrib.auth.models import User, Group
from rest_framework import serializers

from .models import SociedadAnonima, Socio, SocioSA


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


class SociedadAnonimaSerializer(serializers.ModelSerializer):
    """
    Este serializer corresponde a la clase SociedadAnonima (para el create)
    """
    comformation_statute = serializers.FileField(required=False)
    partners = SocioPercentageSerializer(many=True)

    class Meta:
        model = SociedadAnonima
        fields = '__all__'


class SociedadAnonimaRetrieveSerializer(serializers.ModelSerializer):
    """
    Este serializer corresponde a la clase SociedadAnonima (para el get). Parsea correctamente el array de partners
    """
    comformation_statute = serializers.FileField(required=False)
    # ! El nombre de este campo va a ser mejorado con el codigo comentado de abajo
    sociosa_set = SocioSASerializer(many=True)

    class Meta:
        model = SociedadAnonima
        fields = ['name', 'real_domicile', 'legal_domicile', 'creation_date',
                  'comformation_statute', 'export_countries', 'representative_email', 'sociosa_set']
        read_only_fields = (
            'id',
        )

    #     def get_partners(self, obj):
    #     return SocioSASerializer(instance=obj.sociosa_set.all(), many=True)
    # partners = serializers.SerializerMethodField()


class FileSerializer(serializers.Serializer):
    """
    Este serializer corresponde al archivo de estatuto subido para una sociedad anonima
    """
    file = serializers.FileField(required=True)
