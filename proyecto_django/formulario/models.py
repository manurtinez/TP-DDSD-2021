from django.contrib.postgres.fields import ArrayField
from django.db import models


class Pais(models.Model):
    """
    Este modelo representa un pais, con su codigo y los codigos de sus idiomas
    """
    code = models.CharField(max_length=3, null=False, unique=True)
    languages = ArrayField(models.CharField(
        max_length=3, null=False), default=list)


class Exportacion(models.Model):
    """
    Este modelo representa a cuales lugares (continentes, paises, estados) exporta una sociedad anonima.
    """
    sa = models.ForeignKey('SociedadAnonima', on_delete=models.DO_NOTHING)
    continent = models.CharField(max_length=4, null=False)
    country = models.ForeignKey(Pais, on_delete=models.DO_NOTHING)
    states = ArrayField(models.CharField(
        max_length=100, null=False), default=list)


class SociedadAnonima(models.Model):
    name = models.CharField(max_length=30, unique=True)
    creation_date = models.DateField()
    partners = models.ManyToManyField(
        'Socio', through='SocioSA')
    legal_domicile = models.CharField(max_length=30)
    real_domicile = models.CharField(max_length=30)

    comformation_statute = models.FileField(upload_to='uploads/', null=True)
    # Link que corresponde a la carpeta digital en drive
    drive_folder_link = models.CharField(
        max_length=128, unique=True, null=True)

    representative_email = models.CharField(max_length=30)
    stamp_hash = models.CharField(max_length=50, unique=True, null=True)

    case_id = models.IntegerField(unique=True, null=True)

    # "numero" (en realidad UUID) de expediente, unico para cada SA
    numero_expediente = models.CharField(max_length=32, unique=True, null=True)

    class Meta:
        ordering = ['-name']

    def __str__(self):
        return self.name


class Socio(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    dni = models.IntegerField(unique=True)
    # Este es el email del apoderado (no todos los socios parecieran tenerlo)

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

    class Meta():
        # Solo puede existir un par de (socio, SA)
        unique_together = [['partner', 'sa']]
