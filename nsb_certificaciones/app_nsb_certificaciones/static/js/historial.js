function generarCertificado(idEmpleado){
            var data = new FormData();
            data.append('existeEmpleado',true)
            data.append('idEmpleado',idEmpleado)
            var options = {
                method: "POST",
                body:data,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                }
            }
            fetch("/generarCertificado/",options)
            .then(response => response.json())
            .then((data)=>{
                let loader = document.getElementById('loader')
                loader.style.display = "block";
                setTimeout(function() {
                    console.log(data)
                    if(data.estado){
                        loader.style.display = "none";
                        location.reload()
                        descargarPDF(data.url,data.nombreDelArchivo)
                        toastr.success(data.mensaje)
                    }else{
                        loader.style.display = "none";
                        toastr.warning(data.mensaje)
                    }
                }, 3000);                
            })
            .catch((error)=>{
                console.log(error)
            })
}

function descargarPDF(url,nombreDelArchivo) {
    // Nombre del archivo PDF a descargar
    var nombreArchivo = nombreDelArchivo;
    
    // URL del archivo PDF
    var urlArchivo = url; // Cambia esto con la ruta a tu archivo PDF
  
    // Crear un elemento <a> para el enlace de descarga
    var enlaceDescarga = document.createElement('a');
  
    // Configurar el enlace de descarga
    enlaceDescarga.href = urlArchivo;
    enlaceDescarga.download = nombreArchivo;
  
    // Agregar el enlace de descarga al documento y simular el clic
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
  
    // Eliminar el enlace de descarga del documento
    document.body.removeChild(enlaceDescarga);
  }

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}