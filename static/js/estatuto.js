function obtenerBotones(idSociedad, newCell) {
	let newLink = document.createElement("a");
	newLink.text = "Ver estatuto";
    newLink.addEventListener('click', descargarEstatuto.bind(this, idSociedad));
	newLink.classList.add("btn", "btn-color-success", "ms-2", "px-2");
	newCell.appendChild(newLink);
}

async function descargarEstatuto(idSociedad) {
    // VER MAS ADELANTE CUAL ES EL ENDPOINT QUE SE DEFINA EN DJANGO PARA DESCARGAR ESTATUTO
	const response = await fetch(localHost+urlEstauto+idSociedad, {
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
			title: 'El estatuto ha sido descargado correctamente!',
			showConfirmButton: true,
			confirmButtonText: '<a onclick=location.reload(true);>Continuar</a>'
		})
		
	} else {
		// mostrarModalMensaje('Hubo algun error al procesar la solicitud. Por favor, intente nuevamente.');
	}
}


