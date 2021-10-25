const urlCorregir = "";
const urlAprobar = "";
const urlEstampillar = "";
const localHost = window.location.origin;

function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// Muestra un mensaje pasado por parametro en un modal
function mostrarModalMensaje(mensaje) {
	Swal.fire({
		icon: 'warning',
		title: '¡Atención!',
		text: mensaje,
		confirmButtonColor: '#1266f1',
		confirmButtonText: 'Cerrar',
		showClass: {
			popup: 'animate__animated animate__fadeInDown'
		},
		hideClass: {
			popup: 'animate__animated animate__fadeOutUp'
		}
	})
}

// Multiselect customizado
function customSelect(event, multiSelect) {
	optionIndex = event.target.index;
	if (opcionesSeleccionadas.has(optionIndex)) {
		opcionesSeleccionadas.delete(optionIndex);
		multiSelect.options[optionIndex].selected = false;

	} else if (event.target.index != undefined) {
		opcionesSeleccionadas.add(optionIndex);
		multiSelect.options[optionIndex].selected = true;
	}
	// Para prevenir la ejecucion del codigo nativo
	event.preventDefault();
}

// Controla si se pulso la tecla enter
function enterPress(event) {
	if (event.key == "Enter"){
		// Previene la ejecucion del codigo nativo, para que no se realice el submit
		event.preventDefault();
		return true;
	}
}

function agregarOptionEnSelect(select, text, value){
	let newOption = document.createElement("option");
	newOption.text = text;
	newOption.value = value;
	select.add(newOption);
}

function fechaToString(oDate){
    fechaString = oDate.getDate() + "/" + (oDate.getMonth() + 1) + "/" + oDate.getFullYear();
    return fechaString;
}