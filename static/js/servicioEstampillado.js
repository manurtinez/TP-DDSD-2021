// Esto cuando este hecho va a recibir por parametro el id de la sociedad, por ahora siempre la 1
async function getQR(id = 1) {
    const response = await fetch(`http://localhost:8000/sociedad_anonima/${id}/obtener_estampillado/`)
    const imgElement = document.getElementById('qrSociedad')
    if (response.status === 200) {
        jsonResponse = await response.json()
        imgElement.src = `data:image/png;base64,${jsonResponse.qr}`
    } else {
        imgElement.src = 'asd'
        imgElement.onerror = null
    }
}

async function sociedadPorId(idSociedad = 1) {
    // Se contempla solamente el caso positivo si se encontro la sociedad o si no. Faltan agregar los casos para otras respuestas del servidor
    let sociedad = await fetch(localHost + '/sociedad_anonima/' + idSociedad).then(response => response.json());
    return sociedad != null ? sociedad : false;
}

async function socioPorId(idSocio) {
// Se contempla solamente el caso positivo si se encontro la socio o si no. Faltan agregar los casos para otras respuestas del servidor
let socio = await fetch(localHost + '/socio/' + idSocio).then(response => response.json());
return socio != null ? socio : false;
}

async function mostrarSociedad(idSociedad) {
    getQR();
    const sociedad = await sociedadPorId(idSociedad);  
    nombreSociedad.value = sociedad.name;
    fechaCreacion.value =  fechaToString(new Date(sociedad.creation_date));
    sociedad.sociosa_set.forEach(async socioParcial => {
        const socio = await socioPorId(socioParcial.partner);
        let newRow = tablaSocios.tBodies[0].insertRow(-1);
        let newCell = newRow.insertCell(-1);
        let newText = document.createTextNode(socio.last_name + ' ' + socio.first_name);
        newCell.appendChild(newText);
        newCell = newRow.insertCell(-1);
        newText = document.createTextNode(`${socioParcial.percentage} %`);
        newCell.appendChild(newText);
});

}