// Paises y estados seleccionados
var continentesCargados = false;
// const lugaresExportacion = new Set();
const idLugaresExportacion = new Set();
var lugaresExportacion = [];
var languagesInOptions = []

var exportaciones = new Map();

class Export {
	constructor() {
		this.continents = new Map();
	}
	addContinent(aContinent) {
		this.continents = aContinent;
	}
}

class Continent {
	constructor(codeContinent, nameContinent) {
		this.code = codeContinent;
		this.name = nameContinent
		this.countries = new Map();
	}

	addCountry(aCountry) {
		this.countries.set(aCountry.code, aCountry);
	}

	existCountry(aCountry) {
		if (this.countries.has(aCountry)) {
			return this.countries.get(aCountry);
		} else {
			return false;
		}
	}

}

class Country {
	constructor(codePais, namePais,languages) {
		this.code = codePais;
		this.name = namePais;
		this.languages = languages;
		this.states = new Set();
	}
	addState(aState) {
		this.states.add(aState);
	}
	existState(aState) {
		// ver
		return this.states.has(aState);
	}
}



async function cargarProvinciasSociedad() {
	await optionsInDynamicSelect(provinciaSociedad, agregarOptionsEnSelect, agregaMensajeEspera.bind(this, provinciaSociedad, 'Cargando provincias'), getEstados, 'AR');
	addTitleOptions(provinciaSociedad, 'Seleccioná una provincia...');
}

function checkTheCheckAndHideContainer(check, container, aFunction) {
	if (check.checked) {
		aFunction();
		container.hidden = false;
	} else {
		container.hidden = true;
	}
}


async function cargarContinentes() {
	if (!continentesCargados) {
		continentesCargados = true;
		await optionsInDynamicSelect(continenteExportacion, agregarOptionsEnSelect, agregaMensajeEspera.bind(this, continenteExportacion, 'Cargando continentes'), getContinentes);
		addTitleOptions(continenteExportacion, 'Seleccioná un continente...');
	}
}

async function actualizarSelectEstados() {
	continenteExportacion.disabled = paisExportacion.disabled = btnEstadosExportacion.disabled = estadosExportacion.hidden = btnAgregarEstados.disabled = true;
	await optionsInDynamicSelect(estadosExportacion, agregarOptionsEnSelect, agregarMensajeEsperaEnBoton.bind(this, btnEstadosExportacion, 'Cargando estados/provincias'), getEstados, paisExportacion.value);
	paisExportacion.disabled = false;
	if (estadosExportacion.options.length == 0) {
		btnEstadosExportacion.textContent = 'No se encontraron estados (Se agregará solo el continente y el país)';
	} else {
		btnEstadosExportacion.textContent = 'Selecciona los estados/provincias...';
		btnEstadosExportacion.disabled = false
	}
	btnAgregarEstados.disabled = continenteExportacion.disabled = false;
	toggleClasses(btnEstadosExportacion, 'cursor-wait', 'cursor-default');
}

async function actualizarSelectPaises() {
	continenteExportacion.disabled = true;
	btnAgregarEstados.disabled = true;
	estadosExportacion.hidden = true;
	btnEstadosExportacion.disabled = true;
	paisExportacion.innerText = "";
	await optionsInDynamicSelect(paisExportacion, agregarOptionsEnSelectMasLenguajes, agregaMensajeEspera.bind(this, paisExportacion, 'Cargando países'), getPaises, continenteExportacion.value);
	continenteExportacion.disabled = false;
	addTitleOptions(paisExportacion, 'Seleccioná un país...');
}


async function optionsInDynamicSelect(aSelect, aFunctionToAddDataInSelect , aFunctionToShowWaitMessage, aFunctionToGetData, aFilterToGetData) {
	aSelect.disabled = true;
	aSelect.classList.add('cursor-wait');
	let idInterval = aFunctionToShowWaitMessage();
	const options = await aFunctionToGetData(aFilterToGetData);
	clearInterval(idInterval);
	//Resetear opciones
	aSelect.innerText = "";
	aFunctionToAddDataInSelect(options,aSelect)
	aSelect.disabled = false;
	toggleClasses(aSelect, 'cursor-wait', 'cursor-default');
}

function agregarOptionsEnSelect(options,aSelect){
	options.forEach(newOption => {
		agregarOptionEnSelect(aSelect, newOption.name, newOption.code);
	});
}

function agregarOptionsEnSelectMasLenguajes(options,aSelect){
	languagesInOptions = [];
	options.forEach(newOption => {
			agregarOptionEnSelect(aSelect, newOption.name, newOption.code);
			languagesInOptions.push(newOption.languages);
		});
}

function agregaMensajeEspera(aSelect, titleLoading) {
	let option = agregarOptionEnSelect(aSelect, titleLoading);
	//Retornar el intervalo para poder detenerlo 
	return setInterval(loadingData.bind(this, option), 1000);
}

function agregarMensajeEsperaEnBoton(aButton, titleLoading) {
	aButton.textContent = titleLoading;
	aButton.classList.add('cursor-wait');
	return setInterval(loadingData.bind(this, aButton), 1000);
}


function loadingData(anElementWithTextContent) {
	anElementWithTextContent.textContent = anElementWithTextContent.textContent + ' .';
}

function agregarLugarExportacion() {
	let lugaresRepetidos = '';
	let continente, pais;

	if (estadosExportacion.length > 0 && estadosExportacion.selectedOptions.length == 0) {
		let mensaje = 'Por favor, seleccione al menos un estado';
		mostrarModalMensaje(mensaje);
		return false;
	}

	if (exportaciones.has(continenteExportacion.value)) {
		continente = exportaciones.get(continenteExportacion.value);
	}
	else {
		exportaciones.set(continenteExportacion.value, new Continent(continenteExportacion.value, continenteExportacion.text));
		continente = exportaciones.get(continenteExportacion.value);
	}

	if (!(pais = continente.existCountry(paisExportacion.value))) {
		pais = new Country(paisExportacion.value, paisExportacion.text, languagesInOptions[paisExportacion.options.selectedIndex]);
		continente.addCountry(pais);
	}

	if (estadosExportacion.selectedOptions.length == 0) {
		if (pais.existState('-')) {
			lugaresRepetidos += paisExportacion.selectedOptions[0].text + ", ";
		} else {
			pais.addState('-');

			agregarLugarExportacionEnTabla(continenteExportacion.selectedOptions[0].value, continenteExportacion.selectedOptions[0].text, paisExportacion.selectedOptions[0].value, paisExportacion.selectedOptions[0].text, '-');
		}
	} else {
		for (const option of estadosExportacion.selectedOptions) {
			if (pais.existState(option.text)) {
				lugaresRepetidos += option.text + ", ";
			}
			else {
				pais.addState(option.text);

				agregarLugarExportacionEnTabla(continenteExportacion.selectedOptions[0].value, continenteExportacion.selectedOptions[0].text, paisExportacion.selectedOptions[0].value, paisExportacion.selectedOptions[0].text, option.text);
				// lugaresExportacion.add(option.text);
			}
		}
	}
	tablaExportaciones.hidden = false;
	if (lugaresRepetidos) {
		Swal.fire({
			title: 'Los estados listados a continuación ya habian sido agregados:',
			text: lugaresRepetidos.slice(0, -2) + '.',
			icon: 'warning',
		})
	}

}
//ToTest
function quitarLugarExportacion(rowLugarExportacion, idContinente, idPais, estado) {
	Swal.fire({
		title: `¿Estás seguro de quitar el estado: ${estado}?`,
		icon: 'warning',
		reverseButtons: true,
		showCancelButton: true,
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Aceptar'
	}).then((result) => {
		if (result.isConfirmed) {
			let index = rowLugarExportacion.rowIndex;
			// Si el país no tiene estados 
			if (estado == "-") {
				exportaciones.get(idContinente).countries.get(idPais).states.delete("-");
			} else {
				// Si el pais tiene solo el estado borrar el pais
				exportaciones.get(idContinente).countries.get(idPais).states.delete(estado);
			}

			// Si el continente tiene solo el pais del estado y el pais tiene solo ese estado borrar continente
			rowLugarExportacion.remove();
			for (index; index < tablaExportaciones.rows.length; index++) {
				tablaExportaciones.rows[index].cells[0].textContent = tablaExportaciones.rows[index].rowIndex;
			}
		}
	})
}

function agregarLugarExportacionEnTabla(idContinente, continente, idPais, pais, estado) {
	let newRow = tablaExportaciones.tBodies[0].insertRow(-1);
	let newCell = newRow.insertCell(-1);
	// IdFila
	let newText = document.createTextNode(tablaExportaciones.tBodies[0].rows.length);
	newCell.appendChild(newText);
	newCell = newRow.insertCell(-1);
	newText = document.createTextNode(continente);
	newCell.appendChild(newText);
	newCell = newRow.insertCell(-1);
	newText = document.createTextNode(pais);
	newCell.appendChild(newText);
	newCell = newRow.insertCell(-1);
	newText = document.createTextNode(estado);
	newCell.appendChild(newText);
	newCell = newRow.insertCell(-1);
	let iconEliminar = document.createElement('i');
	iconEliminar.title = "Eliminar";
	// iconEliminar.classList.add("far", "fa-trash-alt", "cursor-pointer", "p-2", "btn", "btn-white");
	iconEliminar.classList.add("far", "fa-trash-alt", "cursor-pointer", "p-2", "bg-white", "rounded", "shadow");
	iconEliminar.addEventListener('click', quitarLugarExportacion.bind(this, newRow, idContinente, idPais, estado));
	newCell.appendChild(iconEliminar);
}