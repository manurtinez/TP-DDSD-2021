function obtenerBotones(idSociedad,newCell) {
    let newLink = document.createElement("a");
    newLink.text = "Corregir";
    newLink.addEventListener('click', mostrarComentario.bind(this, idSociedad));
    // newLink.href = "#modalEnviarMail";
    newLink.classList.add("btn", "btn-color-warning", "ms-2", "px-2");
    newCell.appendChild(newLink);
    newLink = document.createElement("a");
    newLink.text = "Aprobar";
    newLink.href = urlAprobar + idSociedad;
    newLink.classList.add("btn", "btn-color-success", "ms-2", "px-2");
    newCell.appendChild(newLink);

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
	const response = await fetch(localHost+urlCorregir+idSociedad, {
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