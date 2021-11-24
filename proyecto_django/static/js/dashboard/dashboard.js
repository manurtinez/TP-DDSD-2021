
function obtenerDatosIniciales() {
	this.mostrarTiempoResolucionProcesos();
	this.mostrarUsuariosMayorCantRechazos();
	this.mostrarUsuariosMayorCantAprobaciones();
	this.mostrarSociedadesEnProcesoAprobacion();
    this.calcularEstadisticasME();
	this.calcularEstadisticasLegales();
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
  console.log("totalAprobados: " +totalAprobados)
  let totalRechazados = parseInt(datos["rechazados"]);
	spanCantConfirmaciones.textContent = totalAprobados;
	spanCantRechazos.textContent = totalRechazados;
	total = totalAprobados + totalRechazados;
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
	console.log("estadisticas legales: "+response);
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
  console.log("totalAprobados: " + totalAprobados)
  let totalRechazados = parseInt(datos["rechazados"]);
	spanCantConfirmacionesLegales.textContent = totalAprobados;

	spanCantRechazosLegales.textContent = totalRechazados;
	total = totalAprobados + totalRechazados;
	
	spansTotal.forEach(span => {
		span.textContent = total;
	
	});
	let porcentajeAprobados = (totalAprobados * 100) / total;
	completarPorcentajes(porcentajeAprobados.toFixed(2),porcentajeSociedadesEstatutoAprobadas,barraPorcentajeEstatutosConfirmados);
	let porcentajeRechazados = (totalAprobados * 100) / total;
	completarPorcentajes(porcentajeRechazados.toFixed(2),porcentajeSociedadesEstatutoRechazadas,barraPorcentajeEstatutosRechazados);

}


function completarPorcentajes(unPorcentaje,spanTextoPorcentaje,barraPorcentaje) {
	spanTextoPorcentaje.textContent = unPorcentaje;
	barraPorcentaje.style.width = unPorcentaje+"%";
}

// SEGUIR DESDE ACA
// ESTADISTICAS SOCIEADES ANONIMAS EN PROCESO DE APROBACION

async function mostrarSociedadesEnProcesoAprobacion() {
	let response = await fetch(localHost + '/estadisticas/sociedades_en_proceso').then(response => response.json());
	let datos = response;
	console.log("estadisticas legales: "+response);
	if (datos) {
		return datos;
	} else {
		return false;
	}

}



// ESTADISTICAS TIEMPO DE RESOLUCION DE LOS PROCESOS
function mostrarTiempoResolucionProcesos() {
	tiempoResolucionProcesos.textContent= "2hs 45 minutos (desde JS)";

}


// ESTADISTICAS USUARIOS CON MAYOR CANTIDAD DE RECHAZOS
async function mostrarUsuariosMayorCantRechazos() {
	let response = await fetch(localHost + '/estadisticas/usuarios/rechazos').then(response => response.json());

	if (response) {
		response.forEach(dato => {  
			//comentarioPrueba.textContent = dato.nombre;
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
		
	} else {
		return false;
	}
}


// ESTADISTICAS USUARIOS CON MAYOR CANTIDAD DE RECHAZOS
async function mostrarUsuariosMayorCantAprobaciones() {
	let response = await fetch(localHost + '/estadisticas/usuarios/aprobaciones').then(response => response.json());

	if (response) {
		response.forEach(dato => {  
			//comentarioPrueba.textContent = dato.nombre;
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
		
	} else {
		return false;
	}
}






