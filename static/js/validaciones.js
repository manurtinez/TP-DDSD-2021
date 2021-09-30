let totalPorcentajeSocios = 0;
const columnaNombre = 1;
const columnaPorcentaje = 2;
var opcionesSeleccionadas = new Set();

function validarFormulario() {

    // NOMBRE DE LA SOCIEDAD
    if (document.formularioSociedad.nombreSociedad.value.length==0 ) {    
        let mensaje = "Por favor, ingresa el nombre de la sociedad."
        document.formularioSociedad.nombreSociedad.focus();    
        mostrarModalMensaje(mensaje)
        return false; 
    } 
    
    // NOMBRE DEL SOCIO - ENTRE 3 Y 50 CARACTERES
    if (document.formularioSociedad.nombreSociedad.value.length > 50 ||
        document.formularioSociedad.nombreSociedad.value.length <= 2) {
        let mensaje = 'Por favor, el nombre de la sociedad debe tener entre 3 y 50 caracteres.';
        document.formularioSociedad.nombreSociedad.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    // NOMBRE DE LA SOCIEDAD - SOLO LETRAS
    /*
    if (/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(document.formularioSociedad.nombreSociedad.value)) {
        let mensaje = 'Por favor, el nombre de la sociedad debe contener solo letras.';
        document.formularioSociedad.nombreSociedad.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }
    */

    // FECHA DE CREACION - VACIO
    if (document.formularioSociedad.fechaCreacion.value.length==0 ) {    
        let mensaje = "Por favor, ingresa la fecha de creación."
        document.formularioSociedad.fechaCreacion.focus();    
        mostrarModalMensaje(mensaje)
        return false;
    } 

    // FECHA DE CREACION - MENOR O IGUAL A LA FECHA ACTUAL
    let today = new Date()
    let fechaActual = today.toISOString().split('T')[0]
    let fechaCreacion = document.formularioSociedad.fechaCreacion.value 
 
    if (fechaCreacion > fechaActual)  {
        document.formularioSociedad.fechaCreacion.focus();   
        let mensaje = "Por favor, la fecha de creación debe ser menor o igual que la fecha actual.";
        mostrarModalMensaje(mensaje) 
        return false; 
    }

    // ESTATUTO DE CONFORMACION - VACIO
    if (document.formularioSociedad.estatuto.value.length == 0)  {      
        let $mensaje = 'Por favor, ingresá el estatuto de conformación.';
        document.formularioSociedad.estatuto.focus();
        mostrarModalMensaje($mensaje);
        return false; 
    }
  
    // ESTATUTO DE CONFORMACION - TAMAÑO DEL ARCHIVO
    var input = document.getElementById('estatuto');
    var file = input.files[0];
    if (file.size > 3000000) {		
        let $mensaje = 'Por favor, el estatuto de conformacón debe pesar menos de 3 megabytes.';
        mostrarModalMensaje($mensaje);
        return false;
    }
  
     // ESTATUTO DE CONFORMACION - FORMATO DEL ARCHIVO 
     var fileInput = document.getElementById('estatuto');
     var filePath = fileInput.value;
     var extensionesPermitidas = /(.pdf|.docx|.odt)$/i;
     if (!extensionesPermitidas.exec(filePath)) {
        fileInput.value = '';
        let $mensaje = 'Por favor, el formato de archivo del estatuto de conformación debe ser .docx, .odt ó .pdf';
        mostrarModalMensaje($mensaje);    
        return false;
     }

     // DOMICILIO LEGAL - VACIO
     if (document.formularioSociedad.domicilioLegal.value.length==0 ) {    
        let mensaje = "Por favor, ingresa el domicilio legal de la sociedad."
        document.formularioSociedad.domicilioLegal.focus();    
        mostrarModalMensaje(mensaje)
        return false; 
    } 

    // DOMICILIO LEGAL - ENTRE 10 Y 80 CARACTERES
    if (document.formularioSociedad.domicilioLegal.value.length > 80 || document.formularioSociedad.domicilioLegal.value.length <= 9) {
        let $mensaje = 'Por favor, el domicilio legal debe tener entre 10  y 80 caracteres.';
        document.formularioSociedad.domicilioLegal.focus();    
        mostrarModalMensaje($mensaje)
        return false;
    }

    // DOMICILIO REAL - VACIO
    if (document.formularioSociedad.domicilioReal.value.length==0 ) {    
        let mensaje = "Por favor, ingresa el domicilio real de la sociedad."
        document.formularioSociedad.domicilioReal.focus();    
        mostrarModalMensaje(mensaje)
        return false; 
    } 

    // DOMICILIO REAL - ENTRE 10 Y 80 CARACTERES
    if (document.formularioSociedad.domicilioReal.value.length > 80 || document.formularioSociedad.domicilioReal.value.length   <= 9) {
        let $mensaje = 'Por favor, el domicilio real debe tener entre 10  y 80 caracteres.';
        document.formularioSociedad.domicilioReal.focus();    
        mostrarModalMensaje($mensaje)
        return false;
    }

    // MAIL - VACIO
    if (document.formularioSociedad.mailApoderado.value.length==0 ) {    
        let mensaje = "Por favor, ingresa el mail de apoderado."
        document.formularioSociedad.mailApoderado.focus();    
        mostrarModalMensaje(mensaje)
        return false; 
    } 

    // MAIL - ENTRE 5 Y 80 CARACTERES
    if (document.formularioSociedad.mailApoderado.value.length > 80 || document.formularioSociedad.mailApoderado.value.length <= 4) {
        let $mensaje = 'Por favor, el mail del apoderado debe tener entre 5 y 80 caracteres.';
        document.formularioSociedad.mailApoderado.focus();    
        mostrarModalMensaje($mensaje)
        return false;
    }

    // MAIL - FORMATO
    if (!(/\S+@\S+\.\S+/.test(document.formularioSociedad.mailApoderado.value))) {
        document.formularioSociedad.mailApoderado.focus();
        let $mensaje = 'Por favor, ingresá el email del apoderado con el formato sancheznicolas@gmail.com';
        mostrarModalMensaje($mensaje);
        return false;
    }

    // LOS PAISES Y ESTADOS SOLO SE DEBEN VALIDAR SI SE TILDÓ "EXPORTA A OTROS PAISES" - HACER

    // PAISES DE EXPORTACION - VACIO
    if (document.formularioSociedad.paisDeExportacion.value == 0 || document.formularioSociedad.paisDeExportacion.value== "") {
        let $mensaje = 'Por favor, seleccioná un país.';
        document.formularioSociedad.paisDeExportacion.focus();
        mostrarModalMensaje($mensaje)
        return false;
    }

    // ESTADOS DE EXPORTACION - VACIO
    if (document.formularioSociedad.estadoDeExportacion.value == 0 || document.formularioSociedad.estadoDeExportacion.value== "") {
        let $mensaje = 'Por favor, seleccioná un estado.';
        document.formularioSociedad.estadoDeExportacion.focus();
        mostrarModalMensaje($mensaje)
        return false;
    }

    // APELLIDO DEL SOCIO
    if (document.formularioSociedad.apellidoSocio.value.length==0 ) {    
        let mensaje = "Por favor, ingresa el apellido del socio."
        document.formularioSociedad.apellidoSocio.focus();    
        mostrarModalMensaje(mensaje)
        return false; 
    } 
    
    // APELLIDO DEL SOCIO - ENTRE 3 Y 50 CARACTERES
    if (document.formularioSociedad.apellidoSocio.value.length > 50 ||
        document.formularioSociedad.apellidoSocio.value.length <= 2) {
        let mensaje = 'Por favor, el apellido del socio debe tener entre 3 y 50 caracteres.';
        document.formularioSociedad.apellidoSocio.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    // APELLIDO DEL SOCIO - SOLO LETRAS
    if (/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(document.formularioSociedad.apellidoSocio.value)) {
        let mensaje = 'Por favor, el apellido del socio debe contener sólo letras.';
        document.formularioSociedad.apellidoSocio.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    // NOMBRE DEL SOCIO - VACIO 
    if (document.formularioSociedad.nombreSocio.value.length==0 ) {    
        let mensaje = "Por favor, ingresa el nombre del socio."
        document.formularioSociedad.nombreSocio.focus();    
        mostrarModalMensaje(mensaje)
        return false; 
    } 
    
    // NOMBRE DEL SOCIO - ENTRE 3 Y 50 CARACTERES
    if (document.formularioSociedad.nombreSocio.value.length > 50 ||
        document.formularioSociedad.nombreSocio.value.length <= 2) {
        let mensaje = 'Por favor, el nombre del socio debe tener entre 3 y 50 caracteres.';
        document.formularioSociedad.nombreSocio.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    // NOMBRE DEL SOCIO - SOLO LETRAS
    if (/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(document.formularioSociedad.nombreSocio.value)) {
        let mensaje = 'Por favor, el nombre del socio debe contener sólo letras.';
        document.formularioSociedad.nombreSocio.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    // PORCENTAJE DE APORTES - VACIO
    if (document.formularioSociedad.porcentajeAportes.value.length == 0)  {      
        let $mensaje = 'Por favor, ingresá un porcentaje de aportes.';
        document.formularioSociedad.porcentajeAportes.focus();
        mostrarModalMensaje($mensaje);
       return false; 
    }

   // PORCENTAJE DE APORTES - MAXIMO 3 NUMEROS
    if (document.formularioSociedad.porcentajeAportes.value.length > 3) {
        let mensaje = 'Por favor, el porcentaje de aportes debe tener como máximo 3 números.';
        document.formularioSociedad.porcentajeAportes.focus();
        mostrarModalMensaje(mensaje);
        return false;
    } 

    // PORCENTAJE DE APORTES - SOLO NUMEROS ¿ADMITE DECIMALES? (DEFINIR)
    // HACER

    // REPRESENTANTE LEGAL/APODERADO - VACIO
    if (document.formularioSociedad.representanteLegal.value == 0 || document.formularioSociedad.representanteLegal.value== "") {
        let $mensaje = 'Por favor, seleccioná un representante legal/apoderado.';
        document.formularioSociedad.representanteLegal.focus();
        mostrarModalMensaje($mensaje)
        return false;
    }

	return true;
}


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

function customSelect(event,multiSelect) {
	optionIndex = event.target.index;
	if(opcionesSeleccionadas.has(optionIndex)){
		opcionesSeleccionadas.delete(optionIndex);
		multiSelect.options[optionIndex].selected = false;

	}else if(event.target.index != undefined){
		opcionesSeleccionadas.add(optionIndex);
		multiSelect.options[optionIndex].selected = true;
	}
    // Para prevenir la ejecucion del codigo nativo
	event.preventDefault();
}

function validarTotalSocios(porcentajeASumar) {
	if (totalPorcentajeSocios + porcentajeASumar <= 100) {
		totalPorcentajeSocios += porcentajeASumar;
		// alert("Total porcentaje socios = " + totalPorcentajeSocios);
		let newRow = tablaSocios.tBodies[0].insertRow(-1);
		let newCell = newRow.insertCell(-1);
		let newText = document.createTextNode(tablaSocios.tBodies[0].rows.length);
		newCell.appendChild(newText);
		newCell = newRow.insertCell(-1);
		newText = document.createTextNode(nombreSocio.value+' '+apellidoSocio.value);
		newCell.appendChild(newText);
		newCell = newRow.insertCell(-1);
		newText = document.createTextNode(porcentajeAportes.value);
		newCell.appendChild(newText);
		newCell = newRow.insertCell(-1);
        let iconEditar = document.createElement('i');
        iconEditar.title = "Modificar";
        iconEditar.classList.add("far","fa-edit");
        newCell.appendChild(iconEditar);
        let iconEliminar = document.createElement('i');
        iconEliminar.title = "Eliminar";
        iconEliminar.classList.add("far","fa-trash-alt");
        newCell.appendChild(iconEliminar);
	} else {
		Swal.fire({
			icon: 'warning',
			title: 'Atención!',
			text: 'Por favor ingrese un porcentaje menor o igual a ' + (100 - totalPorcentajeSocios)
		})
	}
	refrescarTabla();
    apellidoSocio.value = nombreSocio.value = "";
	porcentajeAportes.value = "";
	apellidoSocio.focus();
}

function refrescarTabla() {
	if (tablaSocios.tBodies[0].rows.length > 0) {
		tablaSocios.hidden = false;
	} else {
		tablaSocios.hidden = true;
		if (totalPorcentajeSocios == 100) {
            agregarSocio.disabled = true;
		}
	}
}