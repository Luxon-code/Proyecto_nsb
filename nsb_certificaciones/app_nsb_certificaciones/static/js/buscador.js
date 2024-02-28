function autoComplet(){
    fetch("/obtenerEmpleados/")
        .then(response => response.json())
        .then(data => {
            console.log(data.empleados)
            let textoBuscar = document.getElementById("txtBuscar").value
                if(textoBuscar.length >=2){
                    let lista = `<div class="list-group">`
                    const filtro = data.empleados.filter(filtrar)
                    if(filtro.length>0){
                        filtro.forEach(element => {
                            lista += `<a onClick='empleadoSeleccionado(${JSON.stringify(element)})' class="list-group-item list-group-item-action text-start">${element.empCedula} - ${capitalize(element.empNombre)}</a>`;
                        });
                        lista += `</div>`
                        document.getElementById("listProyectos").innerHTML = lista
                        document.getElementById("listProyectos").style  = `height: 150px;overflow: auto;`
                    }else{
                        document.getElementById("listProyectos").innerHTML = ""
                        document.getElementById("listProyectos").style  = ``;
                    }
                }else{
                    document.getElementById("listProyectos").innerHTML = ""
                    document.getElementById("listProyectos").style  = ``;
                }
        })
}
function filtrar(element) {
    let textoBuscar = document.getElementById("txtBuscar").value.toLowerCase();
    let nombre = element.empNombre.toLowerCase();
    let cedula = element.empCedula;
    
    // Ahora estamos comprobando si el texto de búsqueda se encuentra en el nombre o la ubicación.
    return nombre.includes(textoBuscar) || cedula.includes(textoBuscar);
}

function capitalize(texto) {
    // Dividir el texto en palabras separadas por espacios
    let palabras = texto.split(' ');
  
    // Iterar sobre cada palabra y capitalizar la primera letra
    for (let i = 0; i < palabras.length; i++) {
      palabras[i] = palabras[i].charAt(0).toUpperCase() + palabras[i].slice(1);
    }
  
    // Unir las palabras capitalizadas nuevamente en un solo string
    return palabras.join(' ');
}