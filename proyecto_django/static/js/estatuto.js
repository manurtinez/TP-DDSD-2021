/* sociedad_anonima/a_evaluar */
function obtenerBotones(idSociedad, newCell) {
	let newLink = document.createElement("a");
	newLink.href = `http://localhost:8000/sociedad_anonima/${idSociedad}/obtener_estatuto/`;
	newLink.classList.add("btn", "btn-color-warning", "px-2", "mx-2", "anchoBoton");
	newIcon = document.createElement("i");
	newIcon.classList.add("fa-1-5x", "fas", "fa-file-download");
	newLink.appendChild(newIcon);
	newLink.target = "_blank";
	newCell.appendChild(newLink);

	newLink = document.createElement("a");
	newLink.addEventListener('click', evaluacionEstatuto.bind(this, idSociedad, false));
	newLink.classList.add("btn", "btn-color-danger", 'px-2',  "mx-1", 'anchoBoton');
	newIcon = document.createElement("i");
	newIcon.classList.add("fas", "fa-1-5x", "fa-times");
	newLink.appendChild(newIcon);
	newCell.appendChild(newLink);
	
	newLink = document.createElement("a");
	newLink.addEventListener('click', evaluacionEstatuto.bind(this, idSociedad, true));
	newLink.classList.add("btn", "btn-color-success", 'px-2', 'mx-1', 'anchoBoton');
	newIcon = document.createElement("i");
	newIcon.classList.add("fas", "fa-1-5x", "fa-check");
	newLink.appendChild(newIcon);
	newCell.appendChild(newLink);
	newLink = document.createElement("a");
}

async function descargarEstatuto(idSociedad) {
	// VER MAS ADELANTE CUAL ES EL ENDPOINT QUE SE DEFINA EN DJANGO PARA DESCARGAR ESTATUTO
	const response = await fetch(localHost + urlDescargarEstauto + idSociedad, {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrftoken,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			id: idSociedad
		})
	});
	if (response.status === 201) {
		Swal.fire({
			position: 'top',
			icon: 'success',
			title: 'El estatuto ha sido descargado correctamente!',
			showConfirmButton: true,
			confirmButtonText: '<a onclick=location.reload(true);>Continuar</a>'
		})
	} else {
		// mostrarModalMensaje('Hubo algun error al procesar la solicitud. Por favor, intente nuevamente.');
	}
}

async function evaluacionEstatuto(idSociedad, veredicto) {
	const response = await fetch("http://localhost:8000/sociedad_anonima/" + idSociedad + "/evaluar_estatuto/", {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrftoken,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			idSociedad,
			veredicto
		})
	});
	let icon = veredicto ? "success" : "error";
	let mensaje = veredicto ? "aprobado" : "rechazado";
	let accion = veredicto ? "onclick=location.reload();":"";
	if (response.status === 200) {
		Swal.fire({
			position: 'top',
			icon,
			title: 'El estatuto ha sido ' + mensaje + ' correctamente!',
			showConfirmButton: true,
			confirmButtonText: `<a ${accion}>Continuar</a>`
		}).then((result) => {


		})


	} else {
		mostrarModalMensaje('Hubo algun error al procesar la solicitud. Por favor, intente nuevamente.');
	}
}




async function enviarMailTesting(idSociedad){
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
		confirmButtonText: 'Enviar ',
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


async function rechazarEstatuto(idSociedad) {
	
	// VER MAS ADELANTE CUAL ES EL ENDPOINT QUE SE DEFINA EN SYMFONY PARA ENVIAR MAILS
	const response = await fetch(localHost + urlCorregir + idSociedad, {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrftoken,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			id: idSociedad,
			contenido: comentariosMail.value,
		})
	});
	if (response.status === 201) {
				
		Swal.fire({
			position: 'top',
			icon: 'success',
			title: 'El mail ha sido enviado correctamente!',
			showConfirmButton: true,
			confirmButtonText: '<a onclick=location.reload(true);>Continuar</a>'
		})

	} else {
		// mostrarModalMensaje('Hubo algun error al procesar la solicitud. Por favor, intente nuevamente.');
	}
}