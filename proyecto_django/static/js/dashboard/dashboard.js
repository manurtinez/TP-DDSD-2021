
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
	completarPorcentajes(porcentajeAprobados.toFixed(2),porcentajeEstatutosConfirmados,barraPorcentajeEstatutosConfirmados);
	let porcentajeRechazados = (totalAprobados * 100) / total;
	completarPorcentajes(porcentajeRechazados.toFixed(2),porcentajeEstatutosRechazados,barraPorcentajeEstatutosRechazados);

}


function completarPorcentajes(unPorcentaje,spanTextoPorcentaje,barraPorcentaje) {
	spanTextoPorcentaje.textContent = unPorcentaje;
	barraPorcentaje.style.width = unPorcentaje+"%";
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




