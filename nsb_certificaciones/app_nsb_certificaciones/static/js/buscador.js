window.onload = () => {
    search()
}
function autoComplet(){
    fetch("/obtenerEmpleados/")
        .then(response => response.json())
        .then(data => {
            console.log(data.empleados)
            let textoBuscar = document.getElementById("inputbuscar").value
            if(textoBuscar.length==1){
                document.getElementById("listProyectos").innerHTML = `<div class="list-group"><a href="#" class="list-group-item list-group-item-action">
                <div class="row d-flex justify-content-center">
                    <div class="load-row">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    </div> 
                </div> 
                </a></div>   
                `
            }else{
                if(textoBuscar.length >=2){
                    let lista = `<div class="list-group">`
                    const filtro = data.proyectos.filter(filtrar)
                    if(filtro.length>0){
                        filtro.forEach(element => {
                            lista += `<a href="/vistaDetalleProyecto/${element.id}" class="list-group-item list-group-item-action text-center">${element.nombre} - ${element.ubicacion} <img src="/media/${element.foto}" alt="fotoProyecto" style="width:20px;height:20px;"/></a>`;
                        });
                        lista += `</div>`
                        document.getElementById("listProyectos").innerHTML = lista
                        document.getElementById("listProyectos").style  = `height: 380px;overflow: auto;`
                    }else{
                        document.getElementById("listProyectos").innerHTML = `<div class="list-group"><a href="#" class="list-group-item list-group-item-action text-center">No hay resultados</a></div>`
                    }
                }else{
                    document.getElementById("listProyectos").innerHTML = ""
                }
            }
        })
}
function filtrar(element) {
    let textoBuscar = document.getElementById("inputbuscar").value.toLowerCase();
    let nombre = element.nombre.toLowerCase();
    let ubicacion = element.ubicacion.toLowerCase();
    
    // Ahora estamos comprobando si el texto de búsqueda se encuentra en el nombre o la ubicación.
    return nombre.includes(textoBuscar) || ubicacion.includes(textoBuscar);
}

function search(){
    document.getElementById("inputbuscar").addEventListener("search", (event) =>{
        document.getElementById("listProyectos").innerHTML = ""
        document.getElementById("listProyectos").style = "overflow:hidden;"
        document.getElementById("inputbuscar").value = ""
    })
}