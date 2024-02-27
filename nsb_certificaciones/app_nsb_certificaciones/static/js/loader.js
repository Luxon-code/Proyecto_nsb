// Agregar un event listener para el evento 'readystatechange'
document.addEventListener('readystatechange', function() {
    let loader = document.getElementById('loader')
    // Verificar si el estado del documento es 'complete' (completamente cargado)
    if (document.readyState === 'complete') {
        // Cuando el documento esté completamente cargado, quitar el event listener
        loader.innerHTML = ""
    } else {
        // Si el documento no está completamente cargado, ejecutar la función
        loader.innerHTML = `<div class="blur-background"></div>
        <div class="loader-container">
             <span class="loader"></span>
        </div>`
    }
});