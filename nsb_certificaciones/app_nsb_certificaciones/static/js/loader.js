// Agregar un event listener para el evento 'readystatechange'
document.addEventListener("DOMContentLoaded", function () {
    // Agregar este evento para ocultar el loader después de que se haya cargado la página
    window.addEventListener("load", function () {
        this.setTimeout(()=>{
            const loaderDiv = document.getElementById("loader");
            loaderDiv.style.display = "none";
        }, 500)
    });
  });