
function obtenerDatosIniciales() {
	this.mostrarTiempoResolucionProcesos();
	this.mostrarUsuariosMayorCantRechazos();
	this.mostrarUsuariosMayorCantAprobaciones();
	this.mostrarSociedadesEnProcesoAprobacion();
    this.calcularEstadisticasME(); 
	this.calcularEstadisticasLegales(); 
	// Estadisticas legales
	this.mostrarContieneMayorExportacion();
	this.mostrarLenguajesDePaisesMayorExportacion();
	this.mostrarProvinciasMayorRegistroSociedades();
	this.mostrarContinentesPaisesNoExportacion(); 
}

// ESTADISTICAS MESA DE ENTRADAS
async function obtenerEstadisticasME() {
	let response = await fetch(localHost + '/estadisticas/por_area/mesa').then(response => response.json());
	
	let datos = response;
	if (datos) {
		return datos;
	} else {
		return false;
	}
}

async function calcularEstadisticasME() {
	let datos = await obtenerEstadisticasME();
	spansTotal = document.querySelectorAll('.totalSociedadesRegistradas');
	let totalAprobados = datos["aprobados"];
    let totalRechazados = parseInt(datos["rechazados"]);
	spanCantConfirmaciones.textContent = isNaN(totalAprobados) ? 0 : totalAprobados;
	spanCantRechazos.textContent = isNaN(totalRechazados) ? 0 : totalRechazados;
	total = isNaN(totalAprobados + totalRechazados) ? 0 : totalAprobados + totalRechazados;
	spansTotal.forEach(span => {
		span.textContent = total;
	});
	let porcentajeAprobados = (totalAprobados * 100) / total;
	completarPorcentajes(porcentajeAprobados.toFixed(2),porcentajeSociedadesConfirmadas,barraPorcentajeSociedadesConfirmadas);
	let porcentajeRechazados = (totalRechazados * 100) / total;
	completarPorcentajes(porcentajeRechazados.toFixed(2),porcentajeSociedadesRechazadas,barraPorcentajeSociedadesRechazadas);
}

// ESTADISTICAS LEGALES
async function obtenerEstadisticasLegales() {
	let response = await fetch(localHost + '/estadisticas/por_area/legales').then(response => response.json());

	let datos = response;
	if (datos) {
		return datos;
	} else {
		return false;
	}
}

async function calcularEstadisticasLegales() {
	let datos = await obtenerEstadisticasLegales();
	spansTotal = document.querySelectorAll('.totalEstatutosEvaluados');
	let totalAprobados = datos["aprobados"];
    let totalRechazados = parseInt(datos["rechazados"]);
	spanCantConfirmacionesLegales.textContent = isNaN(totalAprobados) ? 0 : totalAprobados;
	spanCantRechazosLegales.textContent = isNaN(totalRechazados) ? 0 : totalRechazados;
	total = isNaN(totalAprobados + totalRechazados) ? 0 : totalAprobados + totalRechazados;
	spansTotal.forEach(span => {
		span.textContent = total;
	});
	let porcentajeAprobados = (totalAprobados * 100) / total;
	completarPorcentajes(porcentajeAprobados.toFixed(2),porcentajeSociedadesEstatutoAprobadas,barraPorcentajeEstatutosConfirmados);
	let porcentajeRechazados = (totalRechazados * 100) / total;
	completarPorcentajes(porcentajeRechazados.toFixed(2),porcentajeSociedadesEstatutoRechazadas,barraPorcentajeEstatutosRechazados);
}


function completarPorcentajes(unPorcentaje,spanTextoPorcentaje,barraPorcentaje) {
	spanTextoPorcentaje.textContent = isNaN(unPorcentaje) ? 0 : unPorcentaje;
	barraPorcentaje.style.width = unPorcentaje+"%";
}


// ESTADISTICAS SOCIEDADES EN PROCESO
async function mostrarSociedadesEnProcesoAprobacion() {
	let response = await fetch(localHost + '/estadisticas/sociedades_en_proceso').then(response => response.json());

	if (response) {	
		spansTotal = document.querySelectorAll('.totalEstatutosEvaluados');
		let totalActivos = response["activos"];
		let totalFinalizados = response["finalizados"];
		let total = isNaN(totalActivos + totalFinalizados) ? 0 : totalActivos + totalFinalizados;
		spanCantSociedadesActivas.textContent = isNaN(totalActivos) ? 0 : totalActivos;		
		spanTotalSociedades.textContent = isNaN(total) ? 0 : total;

		let porcentajeProcesoAprobacion = (totalActivos * 100) / total;
		completarPorcentajes(porcentajeProcesoAprobacion.toFixed(2),porcentajeSociedadesProcesoAprobacion,barraPorcentajeSociedadesProcesoAprobacion);		
	} else {
		return false;
	}
}


// ESTADISTICAS TIEMPO DE RESOLUCION DE LOS PROCESOS
async function mostrarTiempoResolucionProcesos() {
	let response = await fetch(localHost + '/estadisticas/promedio_resolucion').then(response => response.json());

	if (response) {			
		let minutos = (response / 60);
		let horas = (minutos / 60).toFixed(0);
		let segundos =  (minutos % 1)*60;
		tiempoResolucionProcesos.textContent= horas+ " horas, "+minutos.toFixed(0)+ " minutos, "+segundos.toFixed(0)+ " segundos";
	} else {
		return false;
	}
}


// ESTADISTICAS USUARIOS CON MAYOR CANTIDAD DE RECHAZOS
async function mostrarUsuariosMayorCantRechazos() {
	let response = await fetch(localHost + '/estadisticas/usuarios/rechazos').then(response => response.json());

	if (response == '') {
		let newRow = tablaUsuariosRechazos.tBodies[0].insertRow(-1);
		let newCell = newRow.insertCell(-1);
		newCell.colSpan = 3;
		let newText = document.createTextNode("No se encontraron resultados");
		newCell.appendChild(newText);
	} else {	
		response.forEach(dato => {  	
			let newRow = tablaUsuariosRechazos.tBodies[0].insertRow(-1);
			let newCell = newRow.insertCell(-1);
			let newText = document.createTextNode(dato.cantidad);
			newCell.appendChild(newText);
			newCell = newRow.insertCell(-1);
			newText = document.createTextNode(dato.nombre + ' ' + dato.apellido);
			newCell.appendChild(newText);
			newCell = newRow.insertCell(-1);
			newText = document.createTextNode(dato.rol);
			newCell.appendChild(newText);			
			return newRow.rowIndex; 
		});
	} 
}


// ESTADISTICAS USUARIOS CON MAYOR CANTIDAD DE APROBACIONES
async function mostrarUsuariosMayorCantAprobaciones() {
	let response = await fetch(localHost + '/estadisticas/usuarios/aprobaciones').then(response => response.json());

	if (response == '') {
		let newRow = tablaUsuariosAprobados.tBodies[0].insertRow(-1);
		let newCell = newRow.insertCell(-1);
		newCell.colSpan = 3;
		let newText = document.createTextNode("No se encontraron resultados");
		newCell.appendChild(newText);
	} else {
		response.forEach(dato => {  			
			let newRow = tablaUsuariosAprobados.tBodies[0].insertRow(-1);
			let newCell = newRow.insertCell(-1);
			let newText = document.createTextNode(dato.cantidad);
			newCell.appendChild(newText);
			newCell = newRow.insertCell(-1);
			newText = document.createTextNode(dato.nombre + ' ' + dato.apellido);
			newCell.appendChild(newText);
			newCell = newRow.insertCell(-1);
			newText = document.createTextNode(dato.rol);
			newCell.appendChild(newText);			
			return newRow.rowIndex; 
		});
	}
}



// ESTADISTICAS GEOGRÁFICAS

// CONTINENTE HACIA DONDE MAS SE EXPORTA
async function mostrarContieneMayorExportacion() {
	let response = await fetch(localHost + '/estadisticas_exp/top_continente').then(response => response.json());
	let respuesta = JSON.stringify(response);

	if (respuesta == '{}') {		
		continenteMayorExportacionSinResultados.textContent= "No se encontraron resultados.";		
	} else {			
		continenteMayorExportacion.textContent= respuesta;			
	} 
}


// LENGUAJES DE PAISES HACIA DONDE MAS SE EXPORTA   
async function mostrarLenguajesDePaisesMayorExportacion() {
	let response = await fetch(localHost + '/estadisticas_exp/top_paises_lenguajes/10').then(response => response.json());
	let respuesta = JSON.stringify(response);

	if (respuesta == '') {
		let newRow = tablaLenguajesPaisesExporta.tBodies[0].insertRow(-1);
		let newCell = newRow.insertCell(-1);
		newCell.colSpan = 3;
		let newText = document.createTextNode("No se encontraron resultados");
		newCell.appendChild(newText);
	} else {		
		response.forEach(dato => {  			
			let newRow = tablaLenguajesPaisesExporta.tBodies[0].insertRow(-1);
			let newCell = newRow.insertCell(-1);			
			let newText = document.createTextNode(dato.country_name);
			newCell.appendChild(newText);			 
			newCell = newRow.insertCell(-1);
			dato.languages.forEach(lenguaje =>  {				
				newText = document.createTextNode(lenguaje);				
				newCell.appendChild(newText);
				newText = newText + ' ';
			});
		});
	}
}


// ESTADOS DONDE SE REGISTRAN MAS SOCIEDADES
async function mostrarProvinciasMayorRegistroSociedades() {
	let response = await fetch(localHost + '/estadisticas_exp/top_estados/10').then(response => response.json());

	if (response) {
		response.forEach(dato => {  			
			let newRow = tablaProvinciasRegistroSociedades.tBodies[0].insertRow(-1);
			let newCell = newRow.insertCell(-1);
			let newText = document.createTextNode(dato);
			newCell.appendChild(newText);
			return newRow.rowIndex; 
		});
		
	} else {
		return false;
	}
}


// CONTINENTES Y PAISES A LOS QUE NO SE EXPORTA   
async function mostrarContinentesPaisesNoExportacion() {
	let response = await fetch(localHost + '/estadisticas_exp/continentes_sin_exportaciones/').then(response => response.json());

	if (response == '') {
		let newRow = tablaContientesPaisesExportacion.tBodies[0].insertRow(-1);
		let newCell = newRow.insertCell(-1);
		newCell.colSpan = 3;
		let newText = document.createTextNode("No se encontraron resultados");
		newCell.appendChild(newText);
	} else {				
		for (res in response) {
			let newRow = tablaContientesPaisesExportacion.tBodies[0].insertRow(-1);
			let newCell = newRow.insertCell(-1);		
			let newText = document.createTextNode(res);
			newCell.appendChild(newText);
			newCell = newRow.insertCell(-1);
			newText = document.createTextNode(response[res]);
			newCell.appendChild(newText);		
			console.log("POS: " +res + "resultado: "+response[res]);
			
		}
	}
}




