// ACCIONES - VALIDACIONES

var totalPorcentajeSocios = 0;
var porcentajeRepresentanteSugeridoActual = 0;
var idSocioAgregado;
var idFilaRepresentanteSugerido;
const porcentajesSocios = [];
const columnaNombre = 1;
const columnaPorcentaje = 2;
// Para buscar si el socio ya existia
const idSociosAgregados = new Set();
// Arreglo de objetos con el id y el porcentaje del socio aportado
const sociosEnSociedad = [];

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


function validarAportesSocio() {
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

async function socioPorId(idSocio) {
	// Se contempla solamente el caso positivo si se encontro la socio o si no. Faltan agregar los casos para otras respuestas del servidor
	let socio = await fetch(localHost + '/socio/' + idSocio).then(response => response.json());
	return socio != null ? socio : false;
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
			rowSocio.remove();
			for (index; index < tablaSocios.rows.length; index++) {
				tablaSocios.rows[index].cells[0].textContent = tablaSocios.rows[index].rowIndex;
			}
			if (indexSocio == idFilaRepresentanteSugerido) {
				porcentajeRepresentanteSugeridoActual = 0;
				if (idSociosAgregados.size > 0) {
					idFilaRepresentanteSugerido = encontrarMaximoRepresentante();
					representanteSugerido.textContent = representanteLegal.options[idFilaRepresentanteSugerido].textContent + ' (' + porcentajeRepresentanteSugeridoActual;
				} else {
					representanteSugerido.textContent = "";
				}
			}
			refrescarTabla_Select();
		}
	})
}

function agregarSocioEnSociedad(porcentajeAportado) {
	let socio = {
		id: idSocioAgregado,
		percentage: porcentajeAportado
	};
	idSociosAgregados.add(idSocioAgregado);
	sociosEnSociedad.push(socio);
}

// Select Socios
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

function setSocioRepresentante(index){
	sociosEnSociedad[index].is_representative = true;
}

// Tabla Socios
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

function mostrarCamposAportes() {
	containerAportes.hidden = false;
	containerSocio.hidden = false;
	porcentajeAportes.focus();
}

async function existeSocioConDni(dni) {
	// Se contempla solamente el caso positivo si se encontro al socio o si no. Faltan agregar los casos para otras respuestas del servidor
	let response = await fetch(localHost + '/socio?dni=' + dni).then(response => response.json());
	let socio = response[0];
	if (socio) {
		return socio;
	} else {
		return false;
	}
}

async function buscarSocio(inputDni) {
	if (socio = await existeSocioConDni(inputDni)) {
		idSocioAgregado = socio.id;
		if (idSociosAgregados.has(socio.id)) {
			let mensaje = "El socio ya está ingresado.";
			dniSocio.value = "";
			dniSocio.focus();
			mostrarModalMensaje(mensaje);
			return false;
		} else {
			apellidoSocio.value = socio.last_name;
			nombreSocio.value = socio.first_name;
			mostrarCamposAportes();
		}
	} else {
		registrarSocio();
	}
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
			'<input type="text" id="nombreSocioRegistro" onkeydown="if(enterPress(event)){apellidoSocioRegistro.focus();}checkRegistro()" placeholder="Ingrese el nombre" class="swal2-input">' +
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
			return fetch(localHost+'/socio/', {
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