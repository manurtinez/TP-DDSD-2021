
function obtenerDatosIniciales() {
    this.calcularEstadisticasME();
}


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
	total	= totalAprobados + totalRechazados;
	
	spansTotal.forEach(span => {
		span.textContent = total;
	});
   
}

async function obtenerEstadisticasLegales() {
	let response = await fetch(localHost + '/estadisticas/por_area/legales').then(response => response.json());
	let estadisticasLegales = response[0];
	if (estadisticasLegales) {
        console.log(estadisticasLegales);
		return estadisticasLegales;
	} else {
		return false;
	}
}

/*
VER CUAL SERÁ EL ENDPOINT DE USUARIOS

async function obtenerEstadisticasUsuarios() {
	let response = await fetch(localHost + '/estadisticas/usuarios').then(response => response.json());
	let estadisticasUsuarios = response[0];
	if (estadisticasUsuarios) {
        console.log(estadisticasUsuarios);
		return estadisticasUsuarios;
	} else {
		return false;
	}
}


async function obtenerEstadisticasTiempoDeResolucion() {
	let response = await fetch(localHost + '/estadisticas/tiempo').then(response => response.json());
	let estadisticasTiempo = response[0];
	if (estadisticasTiempo) {
        console.log(estadisticasTiempo);
		return estadisticasTiempo;
	} else {
		return false;
	}
}

*/
