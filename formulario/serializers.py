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
    class Meta:
        model = Socio
        fields = '__all__'


class SocioSASerializer(serializers.ModelSerializer):
    class Meta:
        model = SocioSA
        fields = '__all__'


class SociedadAnonimaSerializer(serializers.ModelSerializer):
    comformation_statute = serializers.FileField(required=False)
    partners = SocioSASerializer(many=True)

    class Meta:
        model = SociedadAnonima
        fields = '__all__'

    # def create(self, validated_data):
    #     partners = validated_data.pop('partners', None)
    #     instance = SociedadAnonima.objects.create(**validated_data)
    #     for p in partners:
    #         print(p)
    #     return instance
