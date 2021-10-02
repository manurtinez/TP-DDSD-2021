# Generated by Django 3.2.7 on 2021-10-01 20:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('formulario', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='socio',
            name='dni',
            field=models.IntegerField(default=1, unique=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='sociedadanonima',
            name='partners',
            field=models.ManyToManyField(through='formulario.SocioSA', to='formulario.Socio'),
        ),
    ]
