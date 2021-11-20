/* sociedad_anonima/a_estampillar */
function obtenerBotones(idSociedad, newCell) {
    let newLink = document.createElement("a");
    newLink.text = "Tomar";
    newLink.href = urlEstampillar + idSociedad;
    newLink.classList.add("btn", "btn-color-success", "ms-2", "px-2");
    newCell.appendChild(newLink);
    /* MOVER LUEGO A VISTA DE 'MIS TAREAS' */
    // newLink = document.createElement("a");
    // newLink.text = "Estampillar";
    // newLink.href = urlEstampillar + idSociedad;
    // newLink.classList.add("btn", "btn-color-success", "ms-2", "px-2");
    // newCell.appendChild(newLink);
}

