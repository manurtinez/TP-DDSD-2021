function validarLogin() {

	// MAIL - VACIO
	if (document.formularioLogin.user.value.length == 0) {
		let mensaje = "Por favor, ingresa el nombre de usuario."
		document.formularioLogin.user.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}

	// MAIL - ENTRE 5 Y 80 CARACTERES
	// if (document.formularioLogin.user.value.length > 80 || document.formularioLogin.user.value.length <= 4) {
	// 	let $mensaje = 'Por favor, el nombre de usuario debe tener entre 5 y 80 caracteres.';
	// 	document.formularioLogin.user.focus();
	// 	mostrarModalMensaje($mensaje)
	// 	return false;
	// }

	// CONTRASEÑA - VACIO
	if (document.formularioLogin.password.value.length == 0) {
		let mensaje = "Por favor, ingresá la contraseña."
		document.formularioLogin.password.focus();
		mostrarModalMensaje(mensaje)
		return false;
	}

	// CONTRASEÑA - ENTRE 5 Y 40 CARACTERES
	// if (document.formularioLogin.password.value.length > 40 || document.formularioLogin.password.value.length <= 4) {
  //       console.log()
	// 	let $mensaje = 'Por favor, la contraseña debe tener entre 5 y 40 caracteres.';
	// 	document.formularioLogin.password.focus();
	// 	mostrarModalMensaje($mensaje)
	// 	return false;
	// }
    return true;
	
}