/* sociedad_anonima/a_evaluar */
function obtenerBotones(idSociedad, newCell) {
	let newLink = document.createElement("a");
    newLink.text = "Descargar estatuto";
    newLink.href = `http://localhost:8000/sociedad_anonima/${idSociedad}/obtener_estatuto/`;
    newLink.classList.add("btn", "btn-color-success", "ms-2", "px-2");
		newLink.target = "_blank";
    newCell.appendChild(newLink);

	/* MOVER LUEGO A VISTA DE 'MIS TAREAS' */
	/* newLink = document.createElement("a");
	newLink.text = "Descargar estatuto";
	newLink.addEventListener('click', descargarEstatuto.bind(this, idSociedad));
	newLink.classList.add("btn", "btn-color-success", "ms-2", "px-2");
	newCell.appendChild(newLink);
	newLink = document.createElement("a");
	newLink.text = "Aprobar";
  newLink.addEventListener('click', aprobarEstatuto.bind(this, idSociedad));
	newLink.classList.add("btn", "btn-color-action", "ms-2", "px-2");
	newCell.appendChild(newLink); */
}

async function descargarEstatuto(idSociedad) {
    // VER MAS ADELANTE CUAL ES EL ENDPOINT QUE SE DEFINA EN DJANGO PARA DESCARGAR ESTATUTO
	const response = await fetch(localHost+urlDescargarEstauto+idSociedad, {
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


async function aprobarEstatuto(idSociedad) {
	 // VER MAS ADELANTE CUAL ES EL ENDPOINT QUE SE DEFINA EN DJANGO PARA APROBAR ESTATUTO
	 const response = await fetch(localHost+urlAprobarEstauto+idSociedad, {
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
			title: 'El estatuto ha sido aprobado correctamente!',
			showConfirmButton: true,
			confirmButtonText: '<a onclick=location.reload(true);>Continuar</a>'
		})
	} else {
		// mostrarModalMensaje('Hubo algun error al procesar la solicitud. Por favor, intente nuevamente.');
	}
}


