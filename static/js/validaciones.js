function validarLogin() {

	// MAIL - VACIO
	if (document.formularioLogin.email.value.length == 0) {
		let mensaje = "Por favor, ingresa el mail."
		document.formularioLogin.email.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}

	// MAIL - ENTRE 5 Y 80 CARACTERES
	if (document.formularioLogin.email.value.length > 80 || document.formularioLogin.email.value.length <= 4) {
		let $mensaje = 'Por favor, el mail debe tener entre 5 y 80 caracteres.';
		document.formularioLogin.email.focus();
		mostrarModalMensaje($mensaje)
		return false;
	}

	// MAIL - FORMATO
	if (!(/\S+@\S+\.\S+/.test(document.formularioLogin.email.value))) {
		document.formularioLogin.email.focus();
		let $mensaje = 'Por favor, ingresá el email con el formato sancheznicolas@gmail.com';
		mostrarModalMensaje($mensaje);
		return false;
	}

	// CONTRASEÑA - VACIO
	if (document.formularioLogin.password.value.length == 0) {
		let mensaje = "Por favor, ingresá la contraseña."
		document.formularioLogin.password.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}

	// CONTRASEÑA - ENTRE 5 Y 40 CARACTERES
	if (document.formularioLogin.password.value.length > 40 || document.formularioLogin.password.value.length <= 4) {
        console.log()
		let $mensaje = 'Por favor, la contraseña debe tener entre 5 y 40 caracteres.';
		document.formularioLogin.password.focus();
		mostrarModalMensaje($mensaje)
		return false;
	}
    return true;
	
}