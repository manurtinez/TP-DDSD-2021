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
	newLink.addEventListener('click', rechazarEstatuto.bind(this, idSociedad));
	newLink.classList.add("btn", "btn-color-danger", 'px-2', "mx-1", 'anchoBoton');
	newIcon = document.createElement("i");
	newIcon.classList.add("fas", "fa-1-5x", "fa-times");
	newLink.appendChild(newIcon);
	newCell.appendChild(newLink);

	newLink = document.createElement("a");
	newLink.addEventListener('click', aprobarEstatuto.bind(this, idSociedad));
	newLink.classList.add("btn", "btn-color-success", 'px-2', 'mx-1', 'anchoBoton');
	newIcon = document.createElement("i");
	newIcon.classList.add("fas", "fa-1-5x", "fa-check");
	newLink.appendChild(newIcon);
	newCell.appendChild(newLink);
	newLink = document.createElement("a");
}

async function descargarEstatuto(idSociedad) {
	// VER MAS ADELANTE CUAL ES EL ENDPOINT QUE SE DEFINA EN DJANGO PARA DESCARGAR ESTATUTO
	// const response = await fetch(localHost + urlDescargarEstauto + idSociedad, {
	// 	method: 'POST',
	// 	headers: {
	// 		'X-CSRFToken': csrftoken,
	// 		'Content-Type': 'application/json',
	// 	},
	// 	body: JSON.stringify({
	// 		id: idSociedad
	// 	})
	// });
	// if (response.status === 201) {
	// 	Swal.fire({
	// 		position: 'top',
	// 		icon: 'success',
	// 		title: 'El estatuto ha sido descargado correctamente!',
	// 		showConfirmButton: true,
	// 		confirmButtonText: '<a onclick=location.reload(true);>Continuar</a>'
	// 	})
	// } else {
	// 	// mostrarModalMensaje('Hubo algun error al procesar la solicitud. Por favor, intente nuevamente.');
	// }
}

async function resolucionEstatuto(idSociedad, veredicto, observaciones) {
	const response = await fetch("http://localhost:8000/sociedad_anonima/" + idSociedad + "/evaluar_estatuto/", {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrftoken,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			idSociedad,
			veredicto,
			observaciones
		})
	});
	return response;
}

async function aprobarEstatuto(idSociedad) {
	const responseEstampillado = await fetch("http://localhost:8000/sociedad_anonima/" + idSociedad + "/solicitar_estampillado/");
	if (responseEstampillado.status === 200) {
		const responseResolucion = await resolucionEstatuto(idSociedad, true);
		if (responseResolucion.status === 200) {
			Swal.fire({
				position: 'top',
				icon: 'success',
				title: 'El estatuto ha sido aprobado correctamente!',
				showConfirmButton: true,
				confirmButtonText: `Continuar`
			}).then((result) => {
				if (result.isConfirmed) {
					location.reload()
				}
			})
		} else {
			mostrarModalMensaje('Hubo algun error al procesar la solicitud. Por favor, intente nuevamente.');
		}
	}
}

async function rechazarEstatuto(idSociedad) {

	Swal.fire({
		title: 'Envío de mail',
		input: 'textarea',
		inputLabel: `Por favor ingrese el mail con las sugerencias (una por línea)`,
		inputPlaceholder: 'Escriba aquí las sugerencias...',
		inputAttributes: { 'aria-label': 'Escriba aquí las sugerencias...' },
		confirmButtonText: 'Enviar mail <i class="far fa-envelope"></i>',
		cancelButtonText: 'Cancelar',
		showCancelButton: true,
		showConfirmButton: true,
		reverseButtons: true,
		showLoaderOnConfirm: true,
		inputValidator: (value) => {
			return new Promise(async (resolve) => {
				if (value == '') {
					resolve('Por favor ingrese el contenido del mail');
				} else {
					resolve();
				}
			})
		},
		preConfirm: (value) => {
			return resolucionEstatuto(idSociedad, false, value)
				.then(response => {
					if (!response.ok) {
						throw new Error(response.statusText)
					}
					else if(response.status === 200){
						Swal.fire({
							position: 'top',
							icon: 'success',
							title: 'La sociedad fue rechazada y el mail ha sido enviado correctamente!',
							showConfirmButton: true,
							confirmButtonText: 'Continuar'
						}).then((result) => {
							if (result.isConfirmed) {
								location.reload()
							}
						})
					}
				})
				.catch(error => {
					Swal.showValidationMessage(
						`${error}. No se pudo enviar el mail. Por favor intentelo nuevamente`
					)
				})
		},
		allowOutsideClick: () => !Swal.isLoading()
	})
}

