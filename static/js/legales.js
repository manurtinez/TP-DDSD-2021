function obtenerBotones(idSociedad, newCell) {
    let newLink = document.createElement("a");
    newLink.text = "Estampillar";
    newLink.href = urlEstampillar + idSociedad;
    newLink.classList.add("btn", "btn-color-success", "ms-2", "px-2");
    newCell.appendChild(newLink);
}

