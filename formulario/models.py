from django.contrib.postgres.fields import ArrayField
from django.db import models


def default_country_list():
    return list(['Argentina'])


# Create your models here.


class SociedadAnonima(models.Model):
    name = models.CharField(max_length=30)
    creation_date = models.DateTimeField(auto_now_add=True)
    partners = models.ManyToManyField(
        'Socio', through='SocioSA')
    legal_domicile = models.CharField(max_length=30)
    real_domicile = models.CharField(max_length=30)
    export_countries = ArrayField(models.CharField(
        max_length=30), default=default_country_list)

    # TODO El file va a haber que definir donde se sube, por ahora local
    comformation_statute = models.FileField(upload_to='uploads/')

    class Meta:
        ordering = ['-name']

    def __str__(self):
        return self.name


class Socio(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    dni = models.IntegerField(unique=True)
    # Este es el email del apoderado (no todos los socios parecieran tenerlo)
    email = models.CharField(max_length=30, null=True)

    class Meta:
        ordering = ['-first_name']

    def __str__(self):
        return self.first_name


# Esta es la join table para un socio con una SA, indicando el porcentaje que le corresponde
class SocioSA(models.Model):
    partner = models.ForeignKey(Socio, on_delete=models.CASCADE)
    sa = models.ForeignKey(SociedadAnonima, on_delete=models.CASCADE)
    percentage = models.FloatField(max_length=4)
    # Este atributo indica si el socio es apoderado de la SA. Se puede llegar al socio en cuestion a traves de esto
    is_representative = models.BooleanField(default=False)

    # class Meta():
    #     # Solo puede existir un par de (socio, SA)
    #     unique_together = [['partner', 'sa']]
