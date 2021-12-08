// ACCIONES - VALIDACIONES


async function validarFormulario(event) {
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

	// PROVINCIA
	if(provinciaSociedad.value == "undefined"){
		let mensaje = "Por favor, seleccioná la provincia de la sociedad."
		document.formularioSociedad.provinciaSociedad.focus();
		mostrarModalMensaje(mensaje)
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

	// ESTADOS DE EXPORTACION - VACIO
	if (checkExporta.checked && (tablaExportaciones.tBodies[0].rows.length == 0)) {
		let $mensaje = 'Tenés la opción de exportación activada. Por favor, seleccioná los lugares de exportación';
		mostrarModalMensaje($mensaje)
		return false;
	}

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
	if (await existeSociedadConNombre(nombreSociedad.value)) {
		let mensaje = 'Ya existe una sociedad con ese nombre, por favor introduzca otro.';
		document.formularioSociedad.nombreSociedad.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}
	setSocioRepresentante(representanteLegal.selectedIndex - 1);
	// TODO mover afuera de la funcion y utilizar el booleano que retorna esta funcion
	registrarSociedad();
	return true;
}

// Esta funcion convierte la estructura de exportaciones a objetos y arrays simples
function map_to_objects(exportaciones) {
    return Array.from(exportaciones).map(
        ([key, value]) => ({
            ...value, countries: Array.from(value.countries).map(
                ([key, value]) => ({...value, states: value.states.has('-') ? [] : Array.from(value.states)})
            )
        })
    )
}


async function registrarSociedad() {
	const response = await fetch(localHost + '/sociedad_anonima/', {
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
			creation_date: document.formularioSociedad.fechaCreacion.value,
			exports : map_to_objects(exportaciones)
		}),

	});
	if (response.status === 201) {
		Swal.fire({
			position: 'top',
			icon: 'success',
			title: 'La sociedad ha sido guardada correctamente!',
			showConfirmButton: true,
			confirmButtonText: 'Continuar'
		}).then((result) => {
			if (result.isConfirmed) {
				location.reload()
			}
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

async function existeSociedadConNombre(nombre) {
	let response = await fetch(localHost + '/sociedad_anonima?name=' + nombre);
	const response_parseada = await response.json();
	return response_parseada.length === 0 ? false : true;
}

async function getSociedadesPorTask(estadoTarea) {
	// hacer lo mismo con el try en todas las peticiones
	try {
		const sociedadesAnonimas = await fetch(localHost + '/bonita/sociedades/obtener_por_task/' + estadoTarea).then(response => response.json());
		// const sociedadesAnonimas = await fetch(localHost + '/sociedad_anonima/').then(response => response.json());
		// mostramos las sociedades en la  tabla
		if (sociedadesAnonimas.length > 0) {
			sociedadesAnonimas.forEach(sociedad => {
				let newRow = tablaSociedad.tBodies[0].insertRow(-1);
				let newCell = newRow.insertCell(-1);
				let newText = document.createTextNode(sociedad.name);
				newCell.appendChild(newText);
				newCell = newRow.insertCell(-1);
				newText = document.createTextNode(fechaToString(new Date(sociedad.creation_date + " 00:00")));
				newCell.appendChild(newText);
				newCell = newRow.insertCell(-1);
				newText = document.createTextNode(sociedad.legal_domicile);
				newCell.appendChild(newText);
				let socioRepresentanteCell = newRow.insertCell(-1);
				sociedad.sociosa_set.forEach(async socioParcial => {
					if (socioParcial.is_representative) {
						socio = await socioPorId(socioParcial.partner);
						let socioRepresentanteText = document.createTextNode(socio.last_name + ' ' + socio.first_name);
						socioRepresentanteCell.appendChild(socioRepresentanteText);
					}
				});
				newCell = newRow.insertCell(-1);
				newText = document.createTextNode(sociedad.representative_email);
				newCell.appendChild(newText);
				newCell = newRow.insertCell(-1);
				newCell.classList.add('px-1', 'align-middle', 'text-nowrap');
				newLink = document.createElement("a");
				newLink.title = "Ver sociedad";
				newLink.classList.add('btn', 'btn-info', 'px-2', 'anchoBoton');
				newLink.addEventListener('click', mostrarSociedad.bind(this, sociedad.id));
				newIcon = document.createElement("i");
				newIcon.classList.add("fas", "fa-1-5x", "fa-eye");
				newLink.appendChild(newIcon);
				newCell.appendChild(newLink);
				obtenerBotones(sociedad.id, newCell);
			});
		}
		else {
			let newRow = tablaSociedad.tBodies[0].insertRow(-1);
			let newCell = newRow.insertCell(-1);
			newCell.colSpan = 6;
			let newText = document.createTextNode("No se han encontrado sociedades");
			newCell.appendChild(newText);
		}
	} catch (error) {
		// mostrarModalMensaje('Ocurrió un error al obtener las sociedades. Por favor, refresque la página');
		console.log(error);
	}
}

async function sociedadPorId(idSociedad) {
	// Se contempla solamente el caso positivo si se encontro la sociedad o si no. Faltan agregar los casos para otras respuestas del servidor
	let sociedad = await fetch(localHost + '/sociedad_anonima/' + idSociedad).then(response => response.json());
	return sociedad != null ? sociedad : false;
}


async function socioRepresentanteDeSociedad(socios) {
	socios.forEach(async socioParcial => {
		if (socioParcial.is_representative) {
			socio = await socioPorId(socioParcial.partner);
			return socio.last_name + ' ' + socio.first_name;
		}
	});
}

async function mostrarSociedad(idSociedad) {
	const sociedad = await sociedadPorId(idSociedad);
	nombreSociedad.textContent = sociedad.name;
	fechaCreacion.textContent = fechaToString(new Date(sociedad.creation_date + " 00:00"));
	domicilioLegal.textContent = sociedad.legal_domicile;
	domicilioReal.textContent = sociedad.real_domicile;
	mailApoderado.textContent = sociedad.representative_email;
	tablaSocios.tBodies[0].replaceWith(document.createElement('tbody'));
	// const socioRepresentante = await socioPorId(sociedad.id_representative);
	// representanteLegal.textContent = socioRepresentante.last_name + ' ' + socioRepresentante.first_name;
	sociedad.sociosa_set.forEach(async socioParcial => {
		const socio = await socioPorId(socioParcial.partner);
		let newRow = tablaSocios.tBodies[0].insertRow(-1);
		let newCell = newRow.insertCell(-1);
		let newText = document.createTextNode(socio.dni);
		newCell.appendChild(newText);
		newCell = newRow.insertCell(-1);
		newText = document.createTextNode(socio.last_name + ' ' + socio.first_name);
		newCell.appendChild(newText);
		newCell = newRow.insertCell(-1);
		newText = document.createTextNode(`${socioParcial.percentage} %`);
		newCell.appendChild(newText);
		if (socioParcial.is_representative) {
			representanteLegal.textContent = socio.last_name + ' ' + socio.first_name;
		}
	});
	const modalSociedad = new mdb.Modal(document.getElementById('modalVerDetalle'));
	modalSociedad.show();
}

async function validarFormularioEditarEstatutoSociedad(event) {

	event.preventDefault()
	// ESTATUTO DE CONFORMACION - VACIO
	if (document.formularioSociedadEditarEstatuto.estatuto.value.length == 0) {
		let $mensaje = 'Por favor, ingresá el estatuto de conformación.';
		document.formularioSociedadEditarEstatuto.estatuto.focus();
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
	modificarEstatuto();
	return true;

}


async function modificarEstatuto() {
	// Modificar el endpoint cuando se tenga el put de actualizar estatuto	
		const formData = new FormData();
		formData.append('file', document.getElementById('estatuto').files[0]);
		// DESCOMENTAR LINEA 386 CUANDO SE TENGA EL ID DE LA SOCIEDAD (POR AHORA VA HARCODEADO EL ID DE LA SOCIEDAD EN LINEA 384)
	/*	const fileResponse = await fetch(`${localHost}/sociedad_anonima/${parsedResponse.id}/subir_archivo/`, { */
		const fileResponse = await fetch(`${localHost}/sociedad_anonima/126/subir_archivo/`, {
			method: 'POST',
			body: formData,
		});

		if (fileResponse.status === 200) {
			Swal.fire({
				position: 'top',
				icon: 'success',
				title: 'El estatuto ha sido modificado correctamente!',
				showConfirmButton: true,
				confirmButtonText: 'Continuar'
			}).then((result) => {
				if (result.isConfirmed) {
					location.href = "http://localhost:8000/";
				}
			})			
		} else if (fileResponse.status !== 200) {		
			mostrarModalMensaje('Hubo un error al subir el archivo. Por favor, reintentelo');
		}
}
