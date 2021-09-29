
function validarFormulario() {

  // NOMBRE
    if (document.formularioSociedad.nombre.value.length==0 ) {    
      let mensaje = "Por favor, ingresa tu nombre."
      document.formularioSociedad.nombre.focus();    
      mostrarModalMensaje(mensaje)
      return false; 
    } 
    
    if (document.formularioSociedad.nombre.value.length > 50 ||
        document.formularioSociedad.nombre.value.length <= 2) {
        let mensaje = 'Por favor, tu nombre debe tener entre 3 y 50 caracteres.';
        document.formularioSociedad.nombre.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    if (/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(document.formularioSociedad.nombre.value)) {
        let mensaje = 'Por favor, tu nombre debe contener solo letras.';
        document.formularioSociedad.nombre.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    // SOCIO
    if (document.formularioSociedad.socio.value.length==0 ) {    
      let mensaje = "Por favor, ingresa el nombre del socio."
      document.formularioSociedad.socio.focus();    
      mostrarModalMensaje(mensaje)
      return false; 
    } 
    
    if (document.formularioSociedad.socio.value.length > 50 ||
        document.formularioSociedad.socio.value.length <= 2) {
        let mensaje = 'Por favor, el nombre del socio debe tener entre 3 y 50 caracteres.';
        document.formularioSociedad.socio.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

    if (/[^a-zA-ZÁÉÍÓÚáéíóúñÑ' ]+/.test(document.formularioSociedad.socio.value)) {
        let mensaje = 'Por favor, el nombre del socio debe contener sólo letras.';
        document.formularioSociedad.socio.focus();
        mostrarModalMensaje(mensaje);
        return false;
    }

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
			  let $mensaje = 'Por favor, el estatuto de conformacón debe pesar menos de 3 mb.';
        mostrarModalMensaje($mensaje);
	  		return false;
		}

    // FALTA VALIDAR TIPO DE ARCHIVO

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

    // PAISES DE EXPORTACION
    if (document.formularioSociedad.paisDeExportacion.value == 0 || document.formularioSociedad.paisDeExportacion.value== "") {
      let $mensaje = 'Por favor, seleccioná un país de exportación.';
      document.formularioSociedad.paisDeExportacion.focus();
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