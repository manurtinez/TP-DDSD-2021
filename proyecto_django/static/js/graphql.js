
// OBTIENE TODOS LOS CONTINENTES
async function getContinentes() {
	let response = await fetch('http://localhost/api/geo/continente').then(response => response.json());
	if (response) {
        console.log(response);
		return datos;
	} else {
		return false;
	}
}


// OBTIENE TODOS LOS PAISES
async function getPaises(continente) {
	let response = await fetch('http://localhost/api/geo/continente/SA/pais').then(response => response.json());
	if (response) {
        console.log(response);
		return datos;
	} else {
		return false;
	}
}

// OBTIENE TODOS LOS ESTADOS/PROVINCIAS