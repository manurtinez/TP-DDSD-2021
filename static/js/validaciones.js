var totalPorcentajeSocios = 0;
var porcentajeRepresentanteSugeridoActual = 0;
var idSocioAgregado;
var idFilaRepresentanteSugerido;
const porcentajesSocios = [];
const columnaNombre = 1;
const columnaPorcentaje = 2;
// Paises y estados seleccionados
const opcionesSeleccionadas = new Set();
// Para buscar si el socio ya existia
const idSociosAgregados = new Set();
// Arreglo de objetos con el id y el porcentaje del socio aportado
const sociosEnSociedad = [];


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

	registrarSociedad();
	Swal.fire({
		position: 'top',
		icon: 'success',
		title: 'La sociedad ha sido guardada correctamente!',
		showConfirmButton: true,
		confirmButtonText: '<a onclick=location.reload(true);>Continuar</a>'
	})
	return true;
}


function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
const csrftoken = getCookie('csrftoken');


async function registrarSociedad() {

	const response = await fetch('http://localhost:8000/sociedad_anonima/', {
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
			representative_email: document.formularioSociedad.mailApoderado.value,
			export_countries: [
				"Bolivia, Paraguay, Venezuela"
			],
			creation_date: document.formularioSociedad.fechaCreacion.value
		})
	});
	if (response.status === 201) {
		const parsedResponse = await response.json();

		// Se sube el archivo de estatuto 
		const formData = new FormData();
		formData.append('file', document.getElementById('estatuto').files[0]);
		const fileResponse = await fetch(`http://localhost:8000/sociedad_anonima/${parsedResponse.id}/subir_archivo/`, {
			method: 'POST',
			body: formData,
		});
		if (fileResponse.status !== 200) {		
			mostrarModalMensaje('Hubo algun error al subir el archivo. Por favor, reintentelo');
		}
	} else {
		mostrarModalMensaje('Hubo algun error al procesar la solicitud. Por favor, intente nuevamente.');
	}
}


function mostrarModalMensaje(mensaje) {
	Swal.fire({
		icon: 'warning',
		title: '¡Atención!',
		text: mensaje,
		confirmButtonColor: '#1266f1',
		confirmButtonText: 'Cerrar',
		showClass: {
			popup: 'animate__animated animate__fadeInDown'
		},
		hideClass: {
			popup: 'animate__animated animate__fadeOutUp'
		}
	})

}

function customSelect(event, multiSelect) {
	optionIndex = event.target.index;
	if (opcionesSeleccionadas.has(optionIndex)) {
		opcionesSeleccionadas.delete(optionIndex);
		multiSelect.options[optionIndex].selected = false;

	} else if (event.target.index != undefined) {
		opcionesSeleccionadas.add(optionIndex);
		multiSelect.options[optionIndex].selected = true;
	}
	// Para prevenir la ejecucion del codigo nativo
	event.preventDefault();
}


function validarInsercionSocio() {
	/*
		// APELLIDO DEL SOCIO - VACIO
		if (document.formularioSociedad.apellidoSocio.value.length == 0) {
			let mensaje = "Por favor, realice la búsqueda del socio antes de agregarlo."
			document.formularioSociedad.apellidoSocio.focus();
			mostrarModalMensaje(mensaje)
			return false;
		}
		// NOMBRE DEL SOCIO - VACIO 
		if (document.formularioSociedad.nombreSocio.value.length == 0) {
			let mensaje = "Por favor, realice la búsqueda del socio antes de agregarlo."
			document.formularioSociedad.nombreSocio.focus();
			mostrarModalMensaje(mensaje)
			return false;
		}
	*/
	// PORCENTAJE DE APORTES - VACIO
	if (document.formularioSociedad.porcentajeAportes.value.length == 0) {
		let $mensaje = 'Por favor, ingresá un porcentaje de aportes.';
		document.formularioSociedad.porcentajeAportes.focus();
		mostrarModalMensaje($mensaje);
		return false;
	}

	// PORCENTAJE DE APORTES - MAXIMO 3 NUMEROS
	if (document.formularioSociedad.porcentajeAportes.value.length > 3) {
		let mensaje = 'Por favor, el porcentaje de aportes debe tener como máximo 3 números.';
		document.formularioSociedad.porcentajeAportes.focus();
		mostrarModalMensaje(mensaje);
		return false;
	}

	// PORCENTAJE DE APORTES - SOLO NUMEROS   
	if (!(/^-?[0-9]+$/.test(document.formularioSociedad.porcentajeAportes.value))) {
		let $mensaje = 'Por favor, el DNI del socio sólo puede contener números.';
		document.formularioSociedad.porcentajeAportes.focus();
		mostrarModalMensaje($mensaje);
		return false;
	}

	// PORCENTAJE DE APORTES - CONTROLAR SUMA
	if (totalPorcentajeSocios + parseInt(porcentajeAportes.value) > 100) {
		let mensaje = 'Por favor ingrese un porcentaje menor o igual a ' + (100 - totalPorcentajeSocios);
		porcentajeAportes.focus();
		mostrarModalMensaje(mensaje);
		return false;
	}
	// PORCENTAJE DE APORTES - NUMEROS NEGATIVOS
	if (parseInt(porcentajeAportes.value) < 0) {
		let mensaje = 'Por favor ingrese un porcentaje, mayor a 0 y menor o igual a ' + (100 - totalPorcentajeSocios);
		porcentajeAportes.focus();
		mostrarModalMensaje(mensaje);
		return false;
	}

	return true;
}

function agregarSocio(porcentajeAportado) {
	if ((totalPorcentajeSocios += porcentajeAportado) == 100) {
		Swal.fire({
			position: 'top',
			icon: 'success',
			title: 'Socios agregados!',
			showConfirmButton: false,
			timer: 1250
		})
		btnAgregarSocio.disabled = true;
		divRepresentanteSugerido.hidden = false;
		containerDni.hidden = true;
	}
	containerAportes.hidden = true;
	containerSocio.hidden = true;
	let filaSocio = agregarSocioEnTabla();
	agregarSocioEnSociedad(porcentajeAportado);
	if (porcentajeAportado >= porcentajeRepresentanteSugeridoActual) {
		idFilaRepresentanteSugerido = filaSocio;
		porcentajeRepresentanteSugeridoActual = porcentajeAportado;
		representanteSugerido.textContent = apellidoSocio.value + ' ' + nombreSocio.value + ' (' + porcentajeAportado;
	}
	refrescarTabla_Select();
	agregarSocioEnSelect();
	porcentajesSocios.push(porcentajeAportado);
	apellidoSocio.value = nombreSocio.value = "";
	porcentajeAportes.value = "";
	dniSocio.value = "";
	dniSocio.focus();
}

function agregarSocioEnSociedad(porcentajeAportado) {
	let socio = {
		id: idSocioAgregado,
		percentage: porcentajeAportado
	};
	idSociosAgregados.add(idSocioAgregado);
	sociosEnSociedad.push(socio);
}

function agregarSocioEnTabla() {
	let newRow = tablaSocios.tBodies[0].insertRow(-1);
	let newCell = newRow.insertCell(-1);
	let newText = document.createTextNode(tablaSocios.tBodies[0].rows.length);
	newCell.appendChild(newText);
	newCell = newRow.insertCell(-1);
	newText = document.createTextNode(nombreSocio.value + ' ' + apellidoSocio.value);
	newCell.appendChild(newText);
	newCell = newRow.insertCell(-1);
	newText = document.createTextNode(porcentajeAportes.value);
	newCell.appendChild(newText);
	newCell = newRow.insertCell(-1);
	// let iconEditar = document.createElement('i');
	// iconEditar.title = "Modificar";
	// iconEditar.classList.add("far", "fa-edit");
	// newCell.appendChild(iconEditar);
	let iconEliminar = document.createElement('i');
	iconEliminar.title = "Eliminar";
	// iconEliminar.classList.add("far", "fa-trash-alt", "cursor-pointer", "p-2", "btn", "btn-white");
	iconEliminar.classList.add("far", "fa-trash-alt", "cursor-pointer", "p-2", "bg-white", "rounded", "shadow");
	iconEliminar.addEventListener('click', eliminarSocio.bind(this, newRow, idSocioAgregado));
	newCell.appendChild(iconEliminar);
	return newRow.rowIndex;
}

function agregarSocioEnSelect() {
	let newOption = document.createElement("option");
	newOption.text = apellidoSocio.value + ' ' + nombreSocio.value;
	newOption.value = idSocioAgregado;
	representanteLegal.add(newOption);
}

function eliminarSocioEnSelect(index) {
	if (representanteLegal.options[index].selected) {
		representanteLegal.options[0].selected = true
	}
	representanteLegal.options[index].remove();
}


function eliminarSocio(rowSocio, idSocio) {

	Swal.fire({
		title: '¿Estás seguro de eliminar al socio?',
		icon: 'warning',
		reverseButtons: true,
		showCancelButton: true,
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Aceptar'
	}).then((result) => {
		if (result.isConfirmed) {
			containerDni.hidden = false;
			let index = rowSocio.rowIndex;
			let indexSocio = rowSocio.rowIndex;
			totalPorcentajeSocios -= parseInt(rowSocio.cells[columnaPorcentaje].textContent);
			if (btnAgregarSocio.disabled) {
				btnAgregarSocio.disabled = false;
			}
			eliminarSocioEnSelect(index);
			idSociosAgregados.delete(idSocio);
			let indexFinded = sociosEnSociedad.findIndex(socio => socio.id === idSocio);
			sociosEnSociedad.splice(indexFinded, 1);
			porcentajesSocios.splice(indexSocio - 1, 1);
			rowSocio.remove()
			for (index; index < tablaSocios.rows.length; index++) {
				tablaSocios.rows[index].cells[0].textContent = tablaSocios.rows[index].rowIndex;
			}
			if (indexSocio == idFilaRepresentanteSugerido) {
				porcentajeRepresentanteSugeridoActual = 0;
				if (idSociosAgregados.size > 0) {
					idFilaRepresentanteSugerido = encontrarMaximoRepresentante();
					representanteSugerido.textContent = representanteLegal.options[idFilaRepresentanteSugerido].textContent+' ('+porcentajeRepresentanteSugeridoActual;
				} else {
					representanteSugerido.textContent = "";
				}
			}
			refrescarTabla_Select();
		}
	})
}

function refrescarTabla_Select() {
	if (tablaSocios.tBodies[0].rows.length > 0) {
		tablaSocios.hidden = representanteLegal.disabled = false;
	} else {
		divRepresentanteSugerido.hidden = tablaSocios.hidden = representanteLegal.disabled = true
	}
}

function encontrarMaximoRepresentante() {
	var indexMaxPorcentaje;
	for (let index = 0; index < porcentajesSocios.length; index++) {
		if (porcentajesSocios[index] > porcentajeRepresentanteSugeridoActual) {
			porcentajeRepresentanteSugeridoActual = porcentajesSocios[index];
			indexMaxPorcentaje = index;
		}
	}
	return indexMaxPorcentaje + 1;
}

function validarDniSocio() {
	// DNI DEL SOCIO - VACIO
	if (document.formularioSociedad.dniSocio.value.length == 0) {
		let mensaje = "Por favor, ingresa el DNI del socio para la búsqueda."
		document.formularioSociedad.dniSocio.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}

	// DNI DEL SOCIO - HASTA 8 CARACTERES
	if (document.formularioSociedad.dniSocio.value.length < 7) {
		let mensaje = 'Por favor, el DNI del socio debe tener como mínimo 7 caracteres.';
		document.formularioSociedad.dniSocio.focus();
		mostrarModalMensaje(mensaje);
		return false;
	}

	// DNI DEL SOCIO - HASTA 8 CARACTERES
	if (document.formularioSociedad.dniSocio.value.length > 8) {
		let mensaje = 'Por favor, el DNI del socio debe tener hasta 8 caracteres.';
		document.formularioSociedad.dniSocio.focus();
		mostrarModalMensaje(mensaje);
		return false;
	}

	// DNI DEL SOCIO - SOLO NUMEROS
	if (!(/^[0-9]+$/.test(document.formularioSociedad.dniSocio.value))) {
		let $mensaje = 'Por favor, el DNI del socio sólo puede contener números.';
		document.formularioSociedad.dniSocio.focus();
		mostrarModalMensaje($mensaje);
		return false;
	}

	return true
}

function mostrarCamposAportes() {
	containerAportes.hidden = false;
	containerSocio.hidden = false;
	porcentajeAportes.focus();
}

async function getSocioAsync() {
	

	let response = await fetch('http://localhost:8000/socio?dni=' + dniSocio.value, {
		method: 'GET',
			headers: {
				mode: 'cors',				
			},
	});
	let socio = await response.json();

	if (socio.length > 0) {
		idSocioAgregado = socio[0].id;
		if (idSociosAgregados.has(idSocioAgregado)) {
			let mensaje = "El socio ya está ingresado.";
			dniSocio.value = "";
			dniSocio.focus();
			mostrarModalMensaje(mensaje);
			return false;
		}
		apellidoSocio.disabled = true;
		nombreSocio.disabled = true;
		apellidoSocio.value = socio[0].last_name;
		nombreSocio.value = socio[0].first_name;
		mostrarCamposAportes();
	} else {
		registrarSocio();
	}
}

function enterPress() {
	return (event.key == "Enter");
}

function checkRegistro() {
	let nombreValido, apellidoValido;
	if (nombreValido = ((nombreSocioRegistro.value.length > 2) && (nombreSocioRegistro.value.length < 50) && (!/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(nombreSocioRegistro.value)))) {
		validacionNombre.hidden = true;
	}
	if (apellidoValido = ((apellidoSocioRegistro.value.length > 2) && (apellidoSocioRegistro.value.length < 50) && (!/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(apellidoSocioRegistro.value)))) {
		validacionApellido.hidden = true;
	}
	btnRegistrarSocio.disabled = !(nombreValido && apellidoValido);
}


function validarRegistroSocio() {

	// APELLIDO DEL SOCIO - VACIO
	if (apellidoSocioRegistro.value.length == 0) {
		validacionApellidoTexto.textContent = "Por favor, ingresa el apellido del socio.";
		validacionApellido.hidden = false;
		apellidoSocioRegistro.focus();
	}

	// NOMBRE DEL SOCIO - VACIO 
	if (nombreSocioRegistro.value.length == 0) {
		validacionNombreTexto.textContent = "Por favor, ingresa el nombre del socio."
		validacionNombre.hidden = false;
		nombreSocioRegistro.focus();
		return false;
	}

	// APELLIDO DEL SOCIO - ENTRE 3 Y 50 CARACTERES
	if (apellidoSocioRegistro.value.length > 50 || apellidoSocioRegistro.value.length <= 2) {
		validacionApellidoTexto.textContent = 'Por favor, el apellido del socio debe tener entre 3 y 50 caracteres.';
		validacionApellido.hidden = false;
		apellidoSocioRegistro.focus();

	}

	// NOMBRE DEL SOCIO - ENTRE 3 Y 50 CARACTERES
	if (nombreSocioRegistro.value.length > 50 || nombreSocioRegistro.value.length <= 2) {
		validacionNombreTexto.textContent = 'Por favor, el nombre del socio debe tener entre 3 y 50 caracteres.';
		validacionNombre.hidden = false;
		nombreSocioRegistro.focus();
		return false;
	}

	// APELLIDO DEL SOCIO - SOLO LETRAS
	if (/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(apellidoSocioRegistro.value)) {
		validacionApellidoTexto.textContent = 'Por favor, el apellido del socio debe contener sólo letras.';
		validacionApellido.hidden = false;
		apellidoSocioRegistro.focus();
	}

	// NOMBRE DEL SOCIO - SOLO LETRAS
	if (/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(nombreSocioRegistro.value)) {
		validacionNombreTexto.textContent = 'Por favor, el nombre del socio debe contener sólo letras.';
		validacionNombre.hidden = false;
		nombreSocioRegistro.focus();
		return false;
	}

}

function registrarSocio() {
	Swal.fire({
		title: 'El socio no se ha encontrado',
		html: '<div class="swal2-html-container mt-0">Por favor registrelo</div>' +
			'<label for="nombreSocioRegistro">Nombre</label>' +
			'<input type="text" id="nombreSocioRegistro" onkeydown="if(enterPress()){apellidoSocioRegistro.focus();}checkRegistro()" placeholder="Ingrese el nombre" class="swal2-input">' +
			'<p class="note note-warning p-1 mt-3 mb-0" id="validacionNombre" hidden><strong>Importante: </strong><small id="validacionNombreTexto"></small></p>' +
			'<label for="apellidoSocioRegistro">Apellido</label>' +
			'<input type="text" id="apellidoSocioRegistro" oninput="checkRegistro()" placeholder="Ingrese el apellido" class="swal2-input">' +
			'<p class="note note-warning p-1 mt-3 mb-0" id="validacionApellido" hidden><strong>Importante: </strong><small id="validacionApellidoTexto"></small></p>',

		customClass: {
			htmlContainer: ''
		},
		cancelButtonText: 'Cancelar',
		showCancelButton: true,
		showConfirmButton: true,
		confirmButtonText: 'Registrar socio',
		reverseButtons: true,
		showLoaderOnConfirm: true,
		preConfirm: (socio) => {
			return fetch('http://localhost:8000/socio/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						first_name: nombreSocioRegistro.value,
						last_name: apellidoSocioRegistro.value,
						dni: dniSocio.value
					})
				})
				.then(response => {
					if (!response.ok) {
						throw new Error(response.statusText)
					}
					return response.json()
				})
				.catch(error => {
					Swal.showValidationMessage(
						`${error}. No se pudo crear el socio`
					)
				})
		},
		allowOutsideClick: () => !Swal.isLoading()
	}).then((result) => {
		if (result.isConfirmed) {
			idSocioAgregado = result.value.id;
			apellidoSocio.value = result.value.first_name;
			nombreSocio.value = result.value.last_name;
			mostrarCamposAportes();
		}
	})
	let buttonSwal = document.getElementsByClassName("swal2-confirm")[0];
	buttonSwal.addEventListener('mouseover', validarRegistroSocio.bind(this));
	buttonSwal.id = "btnRegistrarSocio";
	buttonSwal.disabled = true;
	nombreSocioRegistro.focus();
}