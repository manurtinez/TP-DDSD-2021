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


class SocioSASerializer(serializers.ModelSerializer):
    class Meta:
        model = SocioSA
        fields = ['id', 'partner', 'sa', 'is_representative', 'percentage']


class SociedadAnonimaSerializer(serializers.ModelSerializer):
    comformation_statute = serializers.FileField(required=False)
    partners = SocioSASerializer(many=True, read_only=True)

    class Meta:
        model = SociedadAnonima
        fields = ['id', 'name', 'creation_date', 'partners', 'legal_domicile',
                  'real_domicile', 'export_countries', 'comformation_statute']


class SocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Socio
        fields = ['id', 'first_name', 'last_name', 'email']
