# Generated by Django 3.2.7 on 2021-10-26 21:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('formulario', '0008_sociedadanonima_stamp_hash'),
    ]

    operations = [
        migrations.AddField(
            model_name='sociedadanonima',
            name='case_id',
            field=models.IntegerField(null=True, unique=True),
        ),
    ]
