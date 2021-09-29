
function validarFormulario() {

  // NOMBRE DE LA SOCIEDAD
    if (document.formularioSociedad.nombreSociedad.value.length==0 ) {    
      let mensaje = "Por favor, ingresa el nombre de la sociedad."
      document.formularioSociedad.nombreSociedad.focus();    
      mostrarModalMensaje(mensaje)
      return false; 
    } 
    
    if (document.formularioSociedad.nombreSociedad.value.length > 50 ||
        document.formularioSociedad.nombreSociedad.value.length <= 2) {
        let mensaje = 'Por favor, el nombre de la sociedad debe tener entre 3 y 50 caracteres.';
        document.formularioSociedad.nombreSociedad.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    if (/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(document.formularioSociedad.nombreSociedad.value)) {
        let mensaje = 'Por favor, el nombre de la sociedad debe contener solo letras.';
        document.formularioSociedad.nombreSociedad.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    // FECHA DE CREACION
    if (document.formularioSociedad.fechaCreacion.value.length==0 ) {    
      let mensaje = "Por favor, ingresa la fecha de creación."
      document.formularioSociedad.fechaCreacion.focus();    
      mostrarModalMensaje(mensaje)
      return false;
 
      // VALIDAR QUE LA FECHA DE CREACION SEA MENOR O IGUAL QUE LA FECHA ACTUAL - HACER

    } /*else {
      let fecha =  new Date();
      mensaje = fecha.getDate();
      mostrarModalMensaje(mensaje)
      return false; 
    } */

    //
   /* if () {
      let mensaje = "Por favor, la fecha de creación debe ser menor o igual a la fecha actual."
      document.formularioSociedad.fechaCreacion.focus();    
      mostrarModalMensaje(mensaje)

    } */

    // APELLIDO DEL SOCIO
    if (document.formularioSociedad.apellidoSocio.value.length==0 ) {    
      let mensaje = "Por favor, ingresa el apellido del socio."
      document.formularioSociedad.apellidoSocio.focus();    
      mostrarModalMensaje(mensaje)
      return false; 
    } 
    
    if (document.formularioSociedad.apellidoSocio.value.length > 50 ||
        document.formularioSociedad.apellidoSocio.value.length <= 2) {
        let mensaje = 'Por favor, el apellido del socio debe tener entre 3 y 50 caracteres.';
        document.formularioSociedad.apellidoSocio.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    if (/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(document.formularioSociedad.apellidoSocio.value)) {
        let mensaje = 'Por favor, el apellido del socio debe contener sólo letras.';
        document.formularioSociedad.apellidoSocio.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    // NOMBRE DEL SOCIO
    if (document.formularioSociedad.nombreSocio.value.length==0 ) {    
      let mensaje = "Por favor, ingresa el nombre del socio."
      document.formularioSociedad.nombreSocio.focus();    
      mostrarModalMensaje(mensaje)
      return false; 
    } 
    
    if (document.formularioSociedad.nombreSocio.value.length > 50 ||
        document.formularioSociedad.nombreSocio.value.length <= 2) {
        let mensaje = 'Por favor, el nombre del socio debe tener entre 3 y 50 caracteres.';
        document.formularioSociedad.nombreSocio.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    if (/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(document.formularioSociedad.nombreSocio.value)) {
        let mensaje = 'Por favor, el nombre del socio debe contener sólo letras.';
        document.formularioSociedad.nombreSocio.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    // PORCENTAJE DE APORTES
    // HACER

    // ESTATUTO DE CONFORMACION
    if (document.formularioSociedad.estatuto.value.length == 0)  {      
        let $mensaje = 'Por favor, ingresá el estatuto de conformación.';
        document.formularioSociedad.estatuto.focus();
        mostrarModalMensaje($mensaje);
        return false; 
    }

    var input = document.getElementById('estatuto');
		var file = input.files[0];
    if (file.size > 3000000) {		
			  let $mensaje = 'Por favor, el estatuto de conformacón debe pesar menos de 3 megabytes.';
        mostrarModalMensaje($mensaje);
	  		return false;
		}

    var fileInput = document.getElementById('estatuto');
    var filePath = fileInput.value;
    var extensionesPermitidas = /(.pdf|.docx|.odt)$/i;
    if (!extensionesPermitidas.exec(filePath)) {
        fileInput.value = '';
        let $mensaje = 'Por favor, el formato de archivo del estatuto de conformación debe ser .docx, .odt ó .pdf';
        mostrarModalMensaje($mensaje);    
        return false;
    }

     // DOMICILIO LEGAL
     if (document.formularioSociedad.domicilioLegal.value.length==0 ) {    
      let mensaje = "Por favor, ingresa el domicilio legal de la sociedad."
      document.formularioSociedad.domicilioLegal.focus();    
      mostrarModalMensaje(mensaje)
      return false; 
    } 

    if (document.formularioSociedad.domicilioLegal.value.length > 81 || document.formularioSociedad.domicilioLegal.value.length   <= 9) {
      let $mensaje = 'Por favor, el domicilio legal debe tener entre 10  y 80 caracteres.';
      document.formularioSociedad.domicilioLegal.focus();    
      mostrarModalMensaje($mensaje)
      return false;
    }

    // DOMICILIO REAL
    if (document.formularioSociedad.domicilioReal.value.length==0 ) {    
      let mensaje = "Por favor, ingresa el domicilio real de la sociedad."
      document.formularioSociedad.domicilioReal.focus();    
      mostrarModalMensaje(mensaje)
      return false; 
    } 

    if (document.formularioSociedad.domicilioReal.value.length > 81 || document.formularioSociedad.domicilioReal.value.length   <= 9) {
      let $mensaje = 'Por favor, el domicilio real debe tener entre 10  y 80 caracteres.';
      document.formularioSociedad.domicilioReal.focus();    
      mostrarModalMensaje($mensaje)
      return false;
    }

    // REPRESENTANTE LEGAL/APODERADO
    if (document.formularioSociedad.representanteLegal.value == 0 || document.formularioSociedad.representanteLegal.value== "") {
      let $mensaje = 'Por favor, seleccioná un representante legal/apoderado.';
      document.formularioSociedad.representanteLegal.focus();
      mostrarModalMensaje($mensaje)
      return false;
    }

    // MAIL
    if (document.formularioSociedad.mailApoderado.value.length==0 ) {    
      let mensaje = "Por favor, ingresa el mail de apoderado."
      document.formularioSociedad.mailApoderado.focus();    
      mostrarModalMensaje(mensaje)
      return false; 
    } 

    if (!(/\S+@\S+\.\S+/.test(document.formularioSociedad.mailApoderado.value))) {
        document.formularioSociedad.mailApoderado.focus();
        let $mensaje = 'Por favor, ingresá el email del apoderado con el formato sancheznicolas@gmail.com';
        mostrarModalMensaje($mensaje);
        return false;
    }

    // LOS PAISES Y ESTADOS SOLO SE DEBEN VALIDAR SI SE TILDÓ "EXPORTA A OTROS PAISES" - HACER

    // PAISES DE EXPORTACION
    if (document.formularioSociedad.paisDeExportacion.value == 0 || document.formularioSociedad.paisDeExportacion.value== "") {
      let $mensaje = 'Por favor, seleccioná un país.';
      document.formularioSociedad.paisDeExportacion.focus();
      mostrarModalMensaje($mensaje)
      return false;
    }

    // ESTADOS DE EXPORTACION
    if (document.formularioSociedad.estadoDeExportacion.value == 0 || document.formularioSociedad.estadoDeExportacion.value== "") {
      let $mensaje = 'Por favor, seleccioná un estado.';
      document.formularioSociedad.estadoDeExportacion.focus();
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