from formulario.models import SociedadAnonima, Socio
from django.shortcuts import redirect, render

# Create your views here.


def altaDeFormulario(request):
    # Si es get, devolver el template
    if request.method == 'GET':
        # Aca se podrian pre-cargar los campos en caso de que sea una correccion de datos
        return render(request, 'altaDeFormulario.html')
    else:
        form = request.POST
        # Si el representante legal ya existe, traerlo, sino, crearlo
        # !! Por ahora el porcentaje esta hardcodeado hasta que este el array de socios del front
        representante = Socio.objects.get_or_create(
            first_name=form['representanteLegal'], last_name=form['representanteLegal'], percentage=50.0, representative_email=form['mailApoderado'])[0]

        # Se crea la nueva sociedad anonima con los datos
        nueva_sociedad = SociedadAnonima()
        nueva_sociedad.name = form['nombre']
        nueva_sociedad.legal_domicile = form['domicilioLegal']
        nueva_sociedad.real_domicile = form['domicilioReal']
        nueva_sociedad.legal_representative = representante
        nueva_sociedad.export_countries = list(form['paisDeExportacion'])
        nueva_sociedad.save()

        # Agregar socios aca
        nueva_sociedad.partners.add(representante)
        # Redirection a siguiente pagina correspondiente
        return redirect('/')


def index(request):
    return render(request, 'index.html')
