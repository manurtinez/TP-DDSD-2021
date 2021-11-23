
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
	// completarPorcentajes()
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
	spansTotal = document.querySelectorAll('.totalSociedadesRegistradas');
	let totalAprobados = datos["aprobados"];
    console.log("totalAprobados: " +totalAprobados)
    let totalRechazados = parseInt(datos["rechazados"]);
	spanCantConfirmacionesLegales.textContent = totalAprobados;
	spanCantRechazosLegales.textContent = totalRechazados;
	total = totalAprobados + totalRechazados;
	
	spansTotal.forEach(span => {
		span.textContent = total;
	
	});
}



function completarPorcentajes(unPorcentaje,spanTextoPorcentaje,barraPorcentaje){
	spanTextoPorcentaje.textContent = unPorcentaje;
	// barraPorcentajeSociedadesConfirmadas.width?
}


// ESTADISTICAS SOCIEADES ANONIMAS EN PROCESO DE APROBACION
function mostrarSociedadesEnProcesoAprobacion() {

}


// ESTADISTICAS TIEMPO DE RESOLUCION DE LOS PROCESOS
function mostrarTiempoResolucionProcesos() {
	tiempoResolucionProcesos.textContent= "2hs 45 minutos (desde JS)";

}


// ESTADISTICAS USUARIOS CON MAYOR CANTIDAD DE RECHAZOS
 function mostrarUsuariosMayorCantRechazos() {
	// Esta funcion va a llamar al endpoint de django y renderiza en la tabla, los usuarios con mayor cantidad de rechazos
	comentarioPrueba.textContent = "hola Luisman, estoy imprimiendo desde el js";
}


// ESTADISTICAS USUARIOS CON MAYOR CANTIDAD DE APROBACIONES
function mostrarUsuariosMayorCantAprobaciones() {
	// Esta funcion va a llamar al endpoint de django y renderiza en la tabla, los usuarios con mayor cantidad de aprobaciones
	comentarioPrueba.textContent = "hola";
}




