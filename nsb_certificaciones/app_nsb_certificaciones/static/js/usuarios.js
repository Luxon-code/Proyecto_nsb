function cambiarEstadoUsuario(id){
    let url = `/cambiarEstadoUsuario/${id}`
    fetch(url)
    .then(response =>response.json())
    .then(data =>{
        if(data.estado){
            document.getElementById(`userEstado${id}`).innerHTML = data.mensaje
        }else{
            Swal.fire({
                title: 'Modificar usuario',
                text: data.mensaje,
                icon: 'warning',               
                confirmButtonColor: '#3085d6',             
                confirmButtonText: 'Aceptar'
            }).then((result) => {
                if (result.isConfirmed) {
                   document.getElementById(`estadoInput${id}`).checked = true;
                }
            })
        }
    })
}