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
