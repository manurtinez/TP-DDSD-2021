
const urlCorregir = "";
const urlAprobar = "";

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
				let socioRepresentanteCell = newRow.insertCell(-1);
				sociedad.sociosa_set.forEach(async socioParcial => {
					if (socioParcial.is_representative) {
						 socio = await socioPorId(socioParcial.partner);
						 let socioRepresentanteText = document.createTextNode(socio.last_name + ' ' + socio.first_name);
						 socioRepresentanteCell.appendChild(socioRepresentanteText);
					}
				});
				newCell = newRow.insertCell(-1);
				newText = document.createTextNode(sociedad.representative_email);
				newCell.appendChild(newText);
				newCell = newRow.insertCell(-1);
				newCell.classList.add('px-1','align-middle','text-nowrap'); 
				newLink = document.createElement("a");
				newLink.text = "Ver";
				newLink.classList.add('btn', 'btn-info', 'px-2'); 
				newLink.addEventListener('click', mostrarSociedad.bind(this, sociedad.id));
				newCell.appendChild(newLink);
				newLink = document.createElement("a");
				newLink.text = "Corregir";
				newLink.href = urlCorregir+sociedad.id;
				newLink.classList.add('btn', 'btn-warning', 'ms-2', 'px-2'); 
				newCell.appendChild(newLink);
				newLink = document.createElement("a");
				newLink.text = "Aprobar";
				newLink.href = urlAprobar+sociedad.id;
				newLink.classList.add('btn', 'btn-success', 'ms-2', 'px-2'); 
				newCell.appendChild(newLink);
			});        
		}
		else{
			let newRow = tablaSociedad.tBodies[0].insertRow(-1);
			let newCell = newRow.insertCell(-1);
			newCell.colSpan = 6;
			let newText = document.createTextNode("No se han encontrado sociedades pendientes de aprobación");
			newCell.appendChild(newText);
		}
	} catch (error) {
		mostrarModalMensaje('Ocurrió un error al obtener las sociedades. Por favor, refresque la página');
		console.log(error.response.status);
	}
}

async function sociedadPorId(idSociedad) {
		// Se contempla solamente el caso positivo si se encontro la sociedad o si no. Faltan agregar los casos para otras respuestas del servidor
		let sociedad = await fetch(localHost + '/sociedad_anonima/' + idSociedad).then(response => response.json());
		return sociedad != null ? sociedad : false;
}

async function socioPorId(idSocio) {
	// Se contempla solamente el caso positivo si se encontro la socio o si no. Faltan agregar los casos para otras respuestas del servidor
	let socio = await fetch(localHost + '/socio/' + idSocio).then(response => response.json());
	return socio != null ? socio : false;
}

async function socioRepresentanteDeSociedad(socios){
	socios.forEach(async socioParcial => {
		if (socioParcial.is_representative) {
			 socio = await socioPorId(socioParcial.partner);
			 return socio.last_name + ' ' + socio.first_name;
		}
	});
}

async function mostrarSociedad(idSociedad){
	const sociedad = await sociedadPorId(idSociedad);
	nombreSociedad.textContent = sociedad.name;
	fechaCreacion.textContent = sociedad.creation_date;
	domicilioLegal.textContent = sociedad.legal_domicile;
	domicilioReal.textContent = sociedad.real_domicile;
	mailApoderado.textContent = sociedad.representative_email;
	tablaSocios.tBodies[0].replaceWith(document.createElement('tbody'));
	// const socioRepresentante = await socioPorId(sociedad.id_representative);
	// representanteLegal.textContent = socioRepresentante.last_name + ' ' + socioRepresentante.first_name;
	sociedad.sociosa_set.forEach(async socioParcial => {
		const socio = await socioPorId(socioParcial.partner);
		let newRow = tablaSocios.tBodies[0].insertRow(-1);
		let newCell = newRow.insertCell(-1);
		let newText = document.createTextNode(socio.dni);
		newCell.appendChild(newText);
		newCell = newRow.insertCell(-1);
		newText = document.createTextNode(socio.last_name + ' ' + socio.first_name);
		newCell.appendChild(newText);
		newCell = newRow.insertCell(-1);
		newText = document.createTextNode(`${socioParcial.percentage} %`);
		newCell.appendChild(newText);
		if (socioParcial.is_representative) {
			representanteLegal.textContent = socio.last_name + ' ' + socio.first_name;
		}
	});
	btnModalCorregir.url = urlCorregir+sociedad.id;
	btnModalAprobar.url = urlAprobar+sociedad.id;
	const modalSociedad = new mdb.Modal(document.getElementById('modalVerDetalle'));
	modalSociedad.show();
}
