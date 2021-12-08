
// OBTIENE TODOS LOS CONTINENTES
async function getContinentes() {
	return response = await fetch('http://localhost/api/geo/continente').then(response => response.json());
}


// OBTIENE TODOS LOS PAISES
async function getPaises(continente) {
	return response = await fetch(`http://localhost/api/geo/continente/${continente}/pais`).then(response => response.json());
}

// OBTIENE TODOS LOS ESTADOS/PROVINCIAS
async function getEstados(pais) {
	return response = await fetch(`http://localhost/api/geo/pais/${pais}/estado`).then(response => response.json());
}