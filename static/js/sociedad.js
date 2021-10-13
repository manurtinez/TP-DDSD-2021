// ACCIONES - VALIDACIONES

// Paises y estados seleccionados
const opcionesSeleccionadas = new Set();

function validarFormulario(event) {
	event.preventDefault()

	// NOMBRE DE LA SOCIEDAD
	if (document.formularioSociedad.nombreSociedad.value.length == 0) {
		let mensaje = "Por favor, ingresa el nombre de la sociedad."
		document.formularioSociedad.nombreSociedad.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}


	// NOMBRE DEL SOCIEDAD - ENTRE 3 Y 50 CARACTERES
	if (document.formularioSociedad.nombreSociedad.value.length > 50 ||
		document.formularioSociedad.nombreSociedad.value.length <= 2) {
		let mensaje = 'Por favor, el nombre de la sociedad debe tener entre 3 y 50 caracteres.';
		document.formularioSociedad.nombreSociedad.focus();
		mostrarModalMensaje(mensaje);
		return false;
	}


	// FECHA DE CREACION - VACIO
	if (document.formularioSociedad.fechaCreacion.value.length == 0) {
		let mensaje = "Por favor, ingresa la fecha de creación."
		document.formularioSociedad.fechaCreacion.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}

	// FECHA DE CREACION - MENOR O IGUAL A LA FECHA ACTUAL
	let today = new Date()
	let fechaActual = today.toISOString().split('T')[0]
	let fechaCreacion = document.formularioSociedad.fechaCreacion.value

	if (fechaCreacion > fechaActual) {
		document.formularioSociedad.fechaCreacion.focus();
		let mensaje = "Por favor, la fecha de creación debe ser menor o igual que la fecha actual.";
		mostrarModalMensaje(mensaje)
		return false;
	}

	// ESTATUTO DE CONFORMACION - VACIO
	if (document.formularioSociedad.estatuto.value.length == 0) {
		let $mensaje = 'Por favor, ingresá el estatuto de conformación.';
		document.formularioSociedad.estatuto.focus();
		mostrarModalMensaje($mensaje);
		return false;
	}

	// ESTATUTO DE CONFORMACION - TAMAÑO DEL ARCHIVO
	var input = document.getElementById('estatuto');
	var file = input.files[0];
	if (file.size > 3000000) {
		let $mensaje = 'Por favor, el estatuto de conformacón debe pesar menos de 3 megabytes.';
		mostrarModalMensaje($mensaje);
		return false;
	}

	// ESTATUTO DE CONFORMACION - FORMATO DEL ARCHIVO 
	var fileInput = document.getElementById('estatuto');
	var filePath = fileInput.value;
	var extensionesPermitidas = /(.pdf|.docx|.odt)$/i;
	if (!extensionesPermitidas.exec(filePath)) {
		fileInput.value = '';
		let $mensaje = 'Por favor, el formato de archivo del estatuto de conformación debe ser .docx, .odt ó .pdf';
		mostrarModalMensaje($mensaje);
		return false;
	}

	// DOMICILIO LEGAL - VACIO
	if (document.formularioSociedad.domicilioLegal.value.length == 0) {
		let mensaje = "Por favor, ingresa el domicilio legal de la sociedad."
		document.formularioSociedad.domicilioLegal.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}

	// DOMICILIO LEGAL - ENTRE 10 Y 80 CARACTERES
	if (document.formularioSociedad.domicilioLegal.value.length > 80 || document.formularioSociedad.domicilioLegal.value.length <= 9) {
		let $mensaje = 'Por favor, el domicilio legal debe tener entre 10  y 80 caracteres.';
		document.formularioSociedad.domicilioLegal.focus();
		mostrarModalMensaje($mensaje)
		return false;
	}

	// DOMICILIO REAL - VACIO
	if (document.formularioSociedad.domicilioReal.value.length == 0) {
		let mensaje = "Por favor, ingresa el domicilio real de la sociedad."
		document.formularioSociedad.domicilioReal.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}

	// DOMICILIO REAL - ENTRE 10 Y 80 CARACTERES
	if (document.formularioSociedad.domicilioReal.value.length > 80 || document.formularioSociedad.domicilioReal.value.length <= 9) {
		let $mensaje = 'Por favor, el domicilio real debe tener entre 10  y 80 caracteres.';
		document.formularioSociedad.domicilioReal.focus();
		mostrarModalMensaje($mensaje)
		return false;
	}

	// MAIL - VACIO
	if (document.formularioSociedad.mailApoderado.value.length == 0) {
		let mensaje = "Por favor, ingresa el mail de apoderado."
		document.formularioSociedad.mailApoderado.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}

	// MAIL - ENTRE 5 Y 80 CARACTERES
	if (document.formularioSociedad.mailApoderado.value.length > 80 || document.formularioSociedad.mailApoderado.value.length <= 4) {
		let $mensaje = 'Por favor, el mail del apoderado debe tener entre 5 y 80 caracteres.';
		document.formularioSociedad.mailApoderado.focus();
		mostrarModalMensaje($mensaje)
		return false;
	}

	// MAIL - FORMATO
	if (!(/\S+@\S+\.\S+/.test(document.formularioSociedad.mailApoderado.value))) {
		document.formularioSociedad.mailApoderado.focus();
		let $mensaje = 'Por favor, ingresá el email del apoderado con el formato sancheznicolas@gmail.com';
		mostrarModalMensaje($mensaje);
		return false;
	}

	// LOS PAISES Y ESTADOS SOLO SE DEBEN VALIDAR SI SE TILDÓ "EXPORTA A OTROS PAISES" - HACER
	// DESCOMENTAR LO DE ABAJO LUEGO - EXPLOTA POR EL MULTISELECT

	// PAISES DE EXPORTACION - VACIO
	/*
	if (document.formularioSociedad.paisDeExportacion.value == 0 || document.formularioSociedad.paisDeExportacion.value== "") {
		let $mensaje = 'Por favor, seleccioná un país.';
		document.formularioSociedad.paisDeExportacion.focus();
		mostrarModalMensaje($mensaje)
		return false;
	}
 // COMENTAR
	// ESTADOS DE EXPORTACION - VACIO
	if (document.formularioSociedad.estadoDeExportacion.value == 0 || document.formularioSociedad.estadoDeExportacion.value== "") {
		let $mensaje = 'Por favor, seleccioná un estado.';
		document.formularioSociedad.estadoDeExportacion.focus();
		mostrarModalMensaje($mensaje)
		return false;
	}
*/

	// VALIDAR QUE EL PORCENTAJE  DE APORTES HAYA LLLEGADO AL 100%
	if (totalPorcentajeSocios < 100) {
		let $mensaje = 'Por favor, los socios ingresados no logran completar el 100% de acciones.';
		document.formularioSociedad.apellidoSocio.focus();
		mostrarModalMensaje($mensaje)
		return false;
	}

	// REPRESENTANTE LEGAL/APODERADO - VACIO
	if (representanteLegal.options.selectedIndex == 0) {
		let $mensaje = 'Por favor, seleccioná un representante legal/apoderado.';
		document.formularioSociedad.representanteLegal.focus();
		mostrarModalMensaje($mensaje)
		return false;
	}

	// TODO mover afuera de la funcion y utilizar el booleano que retorna esta funcion
	registrarSociedad();
	return true;
}

async function registrarSociedad() {
	const response = await fetch(localHost+'/sociedad_anonima/', {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrftoken,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name: document.formularioSociedad.nombreSociedad.value,
			real_domicile: document.formularioSociedad.domicilioReal.value,
			legal_domicile: document.formularioSociedad.domicilioLegal.value,
			partners: sociosEnSociedad,
			idApoderado: representanteLegal.value,
			representative_email: document.formularioSociedad.mailApoderado.value,
			export_countries: [
				"Bolivia, Paraguay, Venezuela"
			],
			creation_date: document.formularioSociedad.fechaCreacion.value
		})
	});
	if (response.status === 201) {
		Swal.fire({
			position: 'top',
			icon: 'success',
			title: 'La sociedad ha sido guardada correctamente!',
			showConfirmButton: true,
			confirmButtonText: '<a onclick=location.reload(true);>Continuar</a>'
		})
		const parsedResponse = await response.json();

		// Se sube el archivo de estatuto 
		const formData = new FormData();
		formData.append('file', document.getElementById('estatuto').files[0]);
		const fileResponse = await fetch(`${localHost}/sociedad_anonima/${parsedResponse.id}/subir_archivo/`, {
			method: 'POST',
			body: formData,
		});
		if (fileResponse.status !== 200) {		
			mostrarModalMensaje('Hubo algun error al subir el archivo. Por favor, reintentelo');
		}
	} else {
		// mostrarModalMensaje('Hubo algun error al procesar la solicitud. Por favor, intente nuevamente.');
	}
}
