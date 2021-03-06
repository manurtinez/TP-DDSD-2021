function obtenerBotones(idSociedad, newCell) {
	let newLink = document.createElement("a");
	//newLink.text = "Rechazar";
	newLink.addEventListener('click', veredicto.bind(this, idSociedad, false));
	newLink.classList.add("btn", "btn-color-danger", 'px-2', 'mx-1', 'anchoBoton');
	newIcon = document.createElement("i");
	newIcon.classList.add("fas", "fa-1-5x", "fa-times");
	newLink.appendChild(newIcon);
	newCell.appendChild(newLink);
	newLink = document.createElement("a");

	//newLink.text = "Aprobar";
	newLink.addEventListener('click', veredicto.bind(this, idSociedad, true));
	newLink.classList.add("btn", "btn-color-success", 'px-2', 'anchoBoton');
	newIcon = document.createElement("i");
	newIcon.classList.add("fas", "fa-1-5x", "fa-check");
	newLink.appendChild(newIcon);
	newCell.appendChild(newLink);
	newLink = document.createElement("a");

	/* MOVER LUEGO A VISTA DE 'MIS TAREAS' */
	/* newLink = document.createElement("a");
	newLink.text = "Corregir";
	newLink.addEventListener('click', mostrarComentario.bind(this, idSociedad));
	// newLink.href = "#modalEnviarMail";
	newLink.classList.add("btn", "btn-color-warning", "ms-2", "px-2");
	newCell.appendChild(newLink);
	newLink = document.createElement("a");
	newLink.text = "Aprobar";
	newLink.href = urlAprobar + idSociedad;
	newLink.classList.add("btn", "btn-color-success", "ms-2", "px-2");
	newCell.appendChild(newLink); */
}


async function mostrarComentario(idSociedad) {
	const sociedad = await sociedadPorId(idSociedad);
	mailApoderadoModalCorregir.textContent = sociedad.representative_email;
	btnModalEnviarCorreciones.addEventListener('click', enviarMail.bind(this, idSociedad));
	const modalSociedad = new mdb.Modal(document.getElementById('modalEnvioMail'));
	modalSociedad.show();
}

async function enviarMail(idSociedad) {
	// VER MAS ADELANTE CUAL ES EL ENDPOINT QUE SE DEFINA EN DJANGO PARA ENVIAR MAILS
	// ToDo
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
			confirmButtonText: 'Continuar'
		})

	} else {
		// mostrarModalMensaje('Hubo algun error al procesar la solicitud. Por favor, intente nuevamente.');
	}
}

async function veredicto(idSociedad, veredicto) {
	body.classList.add('cursor-wait');
	// VER MAS ADELANTE CUAL ES EL ENDPOINT QUE SE DEFINA EN DJANGO PARA ENVIAR MAILS
	const response = await fetch("http://localhost:8000/sociedad_anonima/" + idSociedad + "/veredicto_mesa_entrada/", {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrftoken,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			veredicto
		})
	});
	let icon = veredicto ? "success" : "error";
	let mensaje = veredicto ? "aprobada" : "rechazada";
	if (response.status === 200) {
		Swal.fire({
			position: 'top',
			icon,
			title: 'La sociedad ha sido ' + mensaje + ' correctamente!',
			showConfirmButton: true,
			confirmButtonText: 'Continuar'
		}).then((result) => {
			if (result.isConfirmed) {
				location.reload()
			}
		})

	} else {
		// mostrarModalMensaje('Hubo algun error al procesar la solicitud. Por favor, intente nuevamente.');
	}
	toggleClasses(body, 'cursor-wait', 'cursor-default');
}