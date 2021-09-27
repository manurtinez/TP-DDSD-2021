from django.db import models
from django.contrib.postgres.fields import ArrayField


def default_country_list():
    return list(['Argentina'])

# Create your models here.


class SociedadAnonima(models.Model):
    name = models.CharField(max_length=30)
    creation_date = models.DateTimeField(auto_now_add=True)
    partners = models.ManyToManyField('Socio', related_name='socios_de_SA')
    legal_domicile = models.CharField(max_length=30)
    real_domicile = models.CharField(max_length=30)
    export_countries = ArrayField(models.CharField(
        max_length=30), default=default_country_list)

    # TODO El file va a haber que definir donde se sube, por ahora local
    comformation_statute = models.FileField(upload_to='uploads/')

    # El representante legal (apoderado) debe corresponder al socio con mayor porcentaje
    legal_representative = models.ForeignKey(
        'Socio', on_delete=models.SET_NULL, null=True)


class Socio(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    percentage = models.FloatField(max_length=30)
    # Este es el email del apoderado
    representative_email = models.CharField(max_length=30, null=True)
