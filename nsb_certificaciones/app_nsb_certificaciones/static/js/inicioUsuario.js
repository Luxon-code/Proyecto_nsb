$(document).ready(function(){
    $('.dropup').hover(function() {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
    }, function() {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
    });
});
$(document).ready(function(){
  $('.accordion-item').hover(function() {
      const button = $(this).find('.accordion-button.collapsed');
      const divCollapse = $(this).find('.accordion-collapse.collapse');
      if (button.length) {
          button.removeClass('collapsed');
          button.attr('aria-expanded', 'true');
          divCollapse.stop(true, true).delay(200).slideDown(500);
      }
  });

  $('.accordion-item').mouseleave(function() {
      const button = $(this).find('.accordion-button:not(.collapsed)');
      const divCollapse = $(this).find('.accordion-collapse');
      if (button.length) {
          button.addClass('collapsed');
          button.attr('aria-expanded', 'false');
          divCollapse.stop(true, true).delay(200).slideUp(500);
      }
  });
});
$(document).ready(function(){
    $("#txtNombre").on('keyup', function(){
        var value = $(this).val();
        if(value != ""){
            $('#nombreCompleto').removeClass()
            $('#nombreCompleto').text(value)
        }else{
            $('#nombreCompleto').addClass('placeholder col-6 placeholder-sm')
            $('#nombreCompleto').text('')
        }
    }).keyup();
    $("#txtCedula").on('keyup', function(){
        var value = $(this).val();
        if(value != ""){
            $('#cedula').removeClass()
            $('#cedula').text(value)
        }else{
            $('#cedula').addClass('placeholder col-3 placeholder-sm')
            $('#cedula').text('')
        }
    }).keyup();
    $("#cbCargo").on('change', function(){
        var value = $(this).val();
        if(value != ""){
            $('#cargo').removeClass()
            $('#cargo').text(value)
        }else{
            $('#cargo').addClass('placeholder col-3 placeholder-sm')
            $('#cargo').text('')
        }
    })
});

let fechas = []

function guardarFechas(){
    fechaInicial = document.getElementById('txtFechaInicio')
    fechaFinal = document.getElementById('txtFechaFinal')
    if(fechaInicial.value && fechaFinal.value){
        fechas.push([fechaInicial.value,fechaFinal.value])
        fechaInicial.value = ""
        fechaFinal.value = ""
        readFechas()
        fechaMinima()
    }else{
        toastr.info('Por favor ingrese ambas fechas.')
    }
}

function readFechas(){
    let table = document.getElementById('tablaFechas')
    let rowPrinpal = `<tr>
    <td class="col-6">FECHA DE INICIO</td>
    <td class="col-6">FECHA DE TERMINACIÓN</td>
  </tr>`
    let row = ''
    fechas.forEach(fecha => {
        let fechaInicio = new Date(fecha[0]);
        let fechaTerminacion = new Date(fecha[1]);
        // Array para los nombres de los meses
        let meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
        // Formato de la fecha: MES DÍA DE AÑO
        let formattedInicio = `${meses[fechaInicio.getUTCMonth()]} ${fechaInicio.getUTCDate()} DE ${fechaInicio.getUTCFullYear()}`;
        let formattedTerminacion = `${meses[fechaTerminacion.getUTCMonth()]} ${fechaTerminacion.getUTCDate()} DE ${fechaTerminacion.getUTCFullYear()}`;
        row += `<tr>
            <td>${formattedInicio}</td>
            <td>${formattedTerminacion}</td>
        </tr>`
    });
    table.innerHTML=rowPrinpal+row
}

function defaultTable(){
    let table = document.getElementById('tablaFechas')
        let rows = `<tr>
        <td class="col-6">FECHA DE INICIO</td>
        <td class="col-6">FECHA DE TERMINACIÓN</td>
        </tr>
        <tr>
        <td><span class="placeholder col-10 placeholder-sm"></span> </td>
        <td><span class="placeholder col-10 placeholder-sm"></span> </td>
        </tr>
        <tr>
        <td><span class="placeholder col-10 placeholder-sm"></span> </td>
        <td><span class="placeholder col-10 placeholder-sm"></span> </td>
        </tr>
        <tr>
        <td><span class="placeholder col-10 placeholder-sm"></span> </td>
        <td><span class="placeholder col-10 placeholder-sm"></span> </td>
        </tr>
        <tr>
        <td><span class="placeholder col-10 placeholder-sm"></span> </td>
        <td><span class="placeholder col-10 placeholder-sm"></span> </td>
        </tr>
        `
        table.innerHTML = rows
}

function borrarFecha(){
    if(fechas.length == 0){
        defaultTable()
    }else{
        fechas.pop()
        readFechas()
        if(fechas.length == 0){
            defaultTable()
        }
    }
    fechaMinima()
}

function actualizarFechaMinima() {
    let fechaInicioInput = document.getElementById('txtFechaInicio');
    let fechaFinalInput = document.getElementById('txtFechaFinal');
    
    // Si se ha seleccionado una fecha de inicio
    if (fechaInicioInput.value) {
        // Establecer la fecha mínima en el input de fecha final como la fecha de inicio seleccionada
        fechaFinalInput.min = fechaInicioInput.value;
        
        // Si la fecha actual en el input de fecha final es menor que la fecha mínima, restablecerla
        if (fechaFinalInput.value < fechaFinalInput.min) {
            fechaFinalInput.value = fechaFinalInput.min;
        }
    } else {
        // Si no se ha seleccionado una fecha de inicio, restablecer la fecha mínima en el input de fecha final
        fechaFinalInput.min = "";
    }
}

function fechaMinima(){
    let fechaInicial = document.getElementById('txtFechaInicio')
    if(fechas.length==0){
        fechaInicial.min = ""
    }else{
        fechaInicial.min = fechas[fechas.length-1][1]
    }
}

function generarCertificado(){
    if($('#txtNombre').val()&&$('#txtCedula').val()&&$('#cbCargo').val()){
        if(fechas.length!=0){
            var data = new FormData();
            data.append('nombreCompleto',$('#txtNombre').val())
            data.append('cedula',$('#txtCedula').val())
            data.append('cargo',$('#cbCargo').val())
            data.append('fechas',JSON.stringify(fechas))
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
                loader.innerHTML = `<div class="blur-background"></div>
                <div class="loader-container">
                  <span class="loader"></span>
                </div>`
                setTimeout(function() {
                    console.log(data)
                    if(data.estado){
                        txtNombre.value = ""
                        cbCargo.value= ""
                        txtCedula.value= ""
                        defaultTable()
                        fechas.length = 0
                        fechaMinima()
                        $('#nombreCompleto').addClass('placeholder col-6 placeholder-sm')
                        $('#nombreCompleto').text('')
                        $('#cedula').addClass('placeholder col-3 placeholder-sm')
                        $('#cedula').text('')
                        $('#cargo').addClass('placeholder col-3 placeholder-sm')
                        $('#cargo').text('')
                        loader.innerHTML = ""
                        descargarPDF(data.url,data.nombreDelArchivo)
                        toastr.success(data.mensaje)
                    }
                }, 3000);                
            })
            .catch((error)=>{
                console.log(error)
            })
        }else{
            toastr.info('Por favor agregue minimo una fecha')
        }
    }else{
        toastr.info('Por favor ingrese todos los datos')
    }
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

  