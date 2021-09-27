# Generated by Django 3.2.7 on 2021-09-27 22:50

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import formulario.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Socio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('percentage', models.FloatField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='SociedadAnonima',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('legal_domicile', models.CharField(max_length=30)),
                ('real_domicile', models.CharField(max_length=30)),
                ('export_countries', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=30), default=formulario.models.default_country_list, size=None)),
                ('comformation_statute', models.FileField(upload_to='uploads/')),
                ('representative_email', models.CharField(max_length=30)),
                ('legal_representative', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='formulario.socio')),
                ('partners', models.ManyToManyField(related_name='socios_de_SA', to='formulario.Socio')),
            ],
        ),
    ]
