
async function getSociedadesPendientesAprobacion() {
	// hacer lo mismo con el try en todas las peticiones
	try {
		const sociedadesAnonimas = await fetch(localHost + '/sociedad_anonima/').then(response => response.json());
		// mostramos las sociedades en la  tabla
		if (sociedadesAnonimas.length > 0) {
			sociedadesAnonimas.forEach(sociedad => {
				let newRow = tablaSociedad.tBodies[0].insertRow(-1);
				let newCell = newRow.insertCell(-1);
				let newText = document.createTextNode(sociedad.name);
				newCell.appendChild(newText);
				newCell = newRow.insertCell(-1);
				newText = document.createTextNode(sociedad.creation_date);
				newCell.appendChild(newText);
				newCell = newRow.insertCell(-1);
				newText = document.createTextNode(sociedad.legal_domicile);
				newCell.appendChild(newText);
				newCell = newRow.insertCell(-1);
				newText = document.createTextNode('Representante hardcodeado');
				newCell.appendChild(newText);
				newCell = newRow.insertCell(-1);
				newText = document.createTextNode(sociedad.representative_email);
				newCell.appendChild(newText);
				newCell = newRow.insertCell(-1);
				newCell.classList.add('px-1','align-middle','text-nowrap'); 
				newLink = document.createElement("a");
				newLink.text = "Ver";
				//newLink.name = "verDetalle";
			    newLink.setAttribute('data-mdb-toggle', 'modal');
				newLink.setAttribute('data-mdb-target', '#modalVerDetalle');
				newLink.classList.add('btn', 'btn-info', 'px-2'); 
				// newLink.addEventListener('click', restauraTotal.bind(this, inputCantidad, inputPrecio));
				newCell.appendChild(newLink);
				newLink = document.createElement("a");
				newLink.text = "Aprobar";
				newLink.href = ""+sociedad.id;
				newLink.classList.add('btn', 'btn-info', 'ms-2', 'px-2'); 
				newCell.appendChild(newLink);

				// data-toggle="modal" data-target="#modalVerDetalle"
			});        
		}
	} catch (error) {
		mostrarModalMensaje('Ocurrió un error al obtener las sociedades. Por favor, refresque la página');
		console.log(error.response.status);
	}
}
