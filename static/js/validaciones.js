var totalPorcentajeSocios = 0;
var porcentajeRepresentanteSugeridoActual = 0;
var idFilaRepresentanteSugerido;
const columnaNombre = 1;
const columnaPorcentaje = 2;
const opcionesSeleccionadas = new Set();

function validarFormulario() {

	// NOMBRE DE LA SOCIEDAD
	if (document.formularioSociedad.nombreSociedad.value.length == 0) {
		let mensaje = "Por favor, ingresa el nombre de la sociedad."
		document.formularioSociedad.nombreSociedad.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}

	// NOMBRE DEL SOCIO - ENTRE 3 Y 50 CARACTERES
	if (document.formularioSociedad.nombreSociedad.value.length > 50 ||
		document.formularioSociedad.nombreSociedad.value.length <= 2) {
		let mensaje = 'Por favor, el nombre de la sociedad debe tener entre 3 y 50 caracteres.';
		document.formularioSociedad.nombreSociedad.focus();
		mostrarModalMensaje(mensaje);
		return false;
	}

	// NOMBRE DE LA SOCIEDAD - SOLO LETRAS
	/*
	if (/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(document.formularioSociedad.nombreSociedad.value)) {
		let mensaje = 'Por favor, el nombre de la sociedad debe contener solo letras.';
		document.formularioSociedad.nombreSociedad.focus();
		mostrarModalMensaje(mensaje);
		return false;
	}
	*/

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
	if (document.formularioSociedad.representanteLegal.value == 0 || document.formularioSociedad.representanteLegal.value == "") {
		let $mensaje = 'Por favor, seleccioná un representante legal/apoderado.';
		document.formularioSociedad.representanteLegal.focus();
		mostrarModalMensaje($mensaje)
		return false;
	}

	return true;
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

function validarSocio() {
	// APELLIDO DEL SOCIO
	if (document.formularioSociedad.nombreSocio.value.length == 0) {
		let mensaje = "Por favor, ingresa el apellido del socio."
		document.formularioSociedad.nombreSocio.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}

	// APELLIDO DEL SOCIO - ENTRE 3 Y 50 CARACTERES
	if (document.formularioSociedad.apellidoSocio.value.length > 50 ||
		document.formularioSociedad.apellidoSocio.value.length <= 2) {
		let mensaje = 'Por favor, el apellido del socio debe tener entre 3 y 50 caracteres.';
		document.formularioSociedad.apellidoSocio.focus();
		mostrarModalMensaje(mensaje);
		return false;
	}

	// APELLIDO DEL SOCIO - SOLO LETRAS
	if (/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(document.formularioSociedad.apellidoSocio.value)) {
		let mensaje = 'Por favor, el apellido del socio debe contener sólo letras.';
		document.formularioSociedad.apellidoSocio.focus();
		mostrarModalMensaje(mensaje);
		return false;
	}

	// NOMBRE DEL SOCIO - VACIO 
	if (document.formularioSociedad.nombreSocio.value.length == 0) {
		let mensaje = "Por favor, ingresa el nombre del socio."
		document.formularioSociedad.nombreSocio.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}

	// NOMBRE DEL SOCIO - ENTRE 3 Y 50 CARACTERES
	if (document.formularioSociedad.nombreSocio.value.length > 50 ||
		document.formularioSociedad.nombreSocio.value.length <= 2) {
		let mensaje = 'Por favor, el nombre del socio debe tener entre 3 y 50 caracteres.';
		document.formularioSociedad.nombreSocio.focus();
		mostrarModalMensaje(mensaje);
		return false;
	}

	// NOMBRE DEL SOCIO - SOLO LETRAS
	if (/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(document.formularioSociedad.nombreSocio.value)) {
		let mensaje = 'Por favor, el nombre del socio debe contener sólo letras.';
		document.formularioSociedad.nombreSocio.focus();
		mostrarModalMensaje(mensaje);
		return false;
	}

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

	// // *Revisar PORCENTAJE DE APORTES - SOLO NUMEROS   
	// if (/^[0-9]$/.test(document.formularioSociedad.porcentajeAportes.valueAsNumber)) {
	// 	let mensaje = 'Por favor, el porcentaje de aportes debe contener sólo números.';
	// 	document.formularioSociedad.porcentajeAportes.focus();
	// 	mostrarModalMensaje(mensaje);
	// 	return false;
	// }

	// VALIDAR QUE NO SE PUEDAN INGRESAR GUIONES (O SIGNO MENOR)
	// HACER

	// PORCENTAJE DE APORTES - CONTROLAR SUMA
	if (totalPorcentajeSocios + porcentajeAportes.valueAsNumber > 100) {
		let mensaje = 'Por favor ingrese un porcentaje menor o igual a ' + (100 - totalPorcentajeSocios);
		porcentajeAportes.focus();
		mostrarModalMensaje(mensaje);
		return false;
	}
	// PORCENTAJE DE APORTES - NUMEROS NEGATIVOS
	if (porcentajeAportes.valueAsNumber < 0) {
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
	}
	let filaSocio = agregarSocioEnTabla();
	if (porcentajeAportado > porcentajeRepresentanteSugeridoActual) {
		idFilaRepresentanteSugerido = filaSocio;
		porcentajeRepresentanteSugeridoActual = porcentajeAportado;
		representanteSugerido.textContent = apellidoSocio.value + ' ' + nombreSocio.value + ' - ' + porcentajeAportado + '% de aportes';
	}
	refrescarTabla_Select();
	agregarSocioEnSelect();
	apellidoSocio.value = nombreSocio.value = "";
	porcentajeAportes.value = "";
	dniSocio.value="";
	dniSocio.focus();
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
	iconEliminar.addEventListener('click', eliminarSocio.bind(this, newRow));
	newCell.appendChild(iconEliminar);
	return newRow.rowIndex; 
}

function agregarSocioEnSelect() {
	let newOption = document.createElement("option");
	newOption.text = apellidoSocio.value + ' ' + nombreSocio.value;
	// TODO Traer id del socio pedido   
	newOption.value = "idSocio";
	representanteLegal.add(newOption);
}

function eliminarSocio(rowSocio) {
	let index = rowSocio.rowIndex;
	// TODO Cambiar columna porcentaje por input number
	totalPorcentajeSocios -= parseInt(rowSocio.cells[columnaPorcentaje].textContent);
	if (btnAgregarSocio.disabled) {btnAgregarSocio.disabled = false;}
	rowSocio.remove()
	for (index; index < tablaSocios.rows.length; index++) {
		tablaSocios.rows[index].cells[0].textContent = tablaSocios.rows[index].rowIndex;
	}
	refrescarTabla_Select();
	// Revisar indice con opciones del select
	if(representanteLegal.options[index].selected){representanteLegal.options[0].selected=true}
	representanteLegal.options[index].remove();
	if (index == idFilaRepresentanteSugerido){
		// TODO calcular maximo y buscar por representante
	}
}

function refrescarTabla_Select() {
	if (tablaSocios.tBodies[0].rows.length > 0) {
		tablaSocios.hidden = representanteLegal.disabled = false;
	} else {
		tablaSocios.hidden = representanteLegal.disabled = true
	}
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
}

async function getSocioAsync() {	
	let response = await fetch('localhost/sociedad-anonima/socio?dni=' + dni);
	let socio = await response.json();
	if (socio.length >= 1) {
		apellidoSocio.disabled = nombreSocio.readonly = true;
		apellidoSocio.value = socio.apellido;
		nombreSocio.value = socio.nombre;
		containerAportes.hidden = containerSocio.hidden = false;
	} else {
		// let mensaje = "No se ha encontrado el socio, por favor ingresalo."
		// apellidoSocio.focus();
		// mostrarModalMensaje(mensaje)
		// return;
		registrarSocio();
	}
}

function registrarSocio(){
	Swal.fire({
		title: 'El socio no se ha encontrado',
		html:
    '<div class="swal2-html-container">Por favor registrelo</div>' +
		'<label for="nombreSocioRegistro">Nombre</label>'+
    '<input type="text" id="nombreSocioRegistro" placeholder="Ingrese el nombre" class="swal2-input">'+
		'<label for="apellidoSocioRegistro">Apellido</label>'+
		'<input type="text" id="apellidoSocioRegistro" placeholder="Ingrese el apellido" class="swal2-input">',
		customClass: {htmlContainer:''},
		cancelButtonText: 'Cancelar',
		showCancelButton: true,
		showConfirmButton: true,
		confirmButtonText: 'Registrar socio',
		reverseButtons: true,
		showLoaderOnConfirm: true,
		preConfirm: (socio) => {  
			return fetch(`localhost/sociedad-anonima/registrar-socio?nombre=${nombreSocioRegistro.value}&apellido=${apellidoSocioRegistro.value}`)
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
			Swal.fire({
				title: `${result.value.socio}'s avatar`,
				imageUrl: result.value.avatar_url
			})
		}
	})
}