// Esto cuando este hecho va a recibir por parametro el id de la sociedad, por ahora siempre la 1
async function getQR(id) {
	const response = await fetch(`http://localhost:8000/sociedad_anonima/${id}/obtener_estampillado/`)
	const imgElement = document.getElementById('qrSociedad')
	if (response.status === 200) {
		jsonResponse = await response.json()
		imgElement.src = `data:image/png;base64,${jsonResponse.qr}`
	} else {
		imgElement.src = '';
		imgElement.alt = 'El QR no ha podido ser cargado';
	}
}

async function sociedadPorHash(hash) {
	// Se contempla solamente el caso positivo si se encontro la sociedad o si no. Faltan agregar los casos para otras respuestas del servidor
	let sociedad = await fetch(localHost + '/sociedad_anonima/?stamp_hash=' + hash).then(async response => {
		const jsonResponse = await response.json()
		return jsonResponse[0]
	});
	return sociedad != null ? sociedad : false;
}

async function socioPorId(idSocio) {
// Se contempla solamente el caso positivo si se encontro la socio o si no. Faltan agregar los casos para otras respuestas del servidor
let socio = await fetch(localHost + '/socio/' + idSocio).then(response => response.json());
return socio != null ? socio : false;
}

async function mostrarSociedad() {
	const hash = window.location.href.split('/').pop()
	const sociedad = await sociedadPorHash(hash);
	await getQR(sociedad.id);
	nombreSociedad.value = sociedad.name;
	fechaCreacion.value =  fechaToString(new Date(sociedad.creation_date+" 00:00"));
	sociedad.sociosa_set.forEach(async socioParcial => {
		const socio = await socioPorId(socioParcial.partner);
		let newRow = tablaSocios.tBodies[0].insertRow(-1);
		let newCell = newRow.insertCell(-1);
		let newText = document.createTextNode(socio.last_name + ' ' + socio.first_name);
		newCell.appendChild(newText);
		newCell = newRow.insertCell(-1);
		newText = document.createTextNode(`${socioParcial.percentage} %`);
		newCell.appendChild(newText);
		if (socioParcial.is_representative) {
			newRow.classList.add('bg-beige');
			newRow.title="Apoderado";
		}
});
}

// http://raw.githack.com/MrRio/jsPDF/master/
function generarPDF(){
	const doc = new jsPDF();

	doc.setFontSize(20);
	doc.setFont("arial", "bold");
	doc.text("INFORMACIÓN PÚBLICA DE SOCIEDAD ANÓNIMA", 105, 20, null, null, "center");
	doc.setFontSize(16);
	doc.setFont("arial", "normal");
	// const iBox = document.createTextNode("\⏹");
	doc.text(20, 40,`Nombre: ${nombreSociedad.value}`);
	doc.text(20, 60, "Fecha de creación: " + fechaCreacion.value);
	doc.setFontSize(14);

	doc.text(20, 80, "Código QR : ");
	doc.addImage(qrSociedad, 'png', 50, 68, 50, 50);	

	
	doc.text(20, 125, "Listado de socios: ");
	let headers = createHeaders([
		"Apellido y nombre",
		"Porcentaje de acciones"
	]);
	
	doc.table(20, 130, generateData(), headers, { autoSize: false });

	doc.save('sociedadAnonima.pdf');
}

function createHeaders(keys) {
	var result = [];
	for (var i = 0; i < keys.length; i += 1) {
	  result.push({
		id: keys[i],
		name: keys[i],
		prompt: keys[i],
		width: 120,
		align: "center",
		padding: 0
	  });
	}
	return result;
  }

  function generateData(){
	var result = [];
	tablaSocios.tBodies[0].rows.forEach(row => {
		result.push({ "Apellido y nombre" : row.cells[0].textContent, "Porcentaje de acciones" : row.cells[1].textContent});	
	});
	return result
  }

