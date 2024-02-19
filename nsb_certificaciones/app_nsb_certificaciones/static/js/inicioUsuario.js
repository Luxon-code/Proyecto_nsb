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
        let formattedInicio = `${meses[fechaInicio.getMonth()]} ${fechaInicio.getDate()} DE ${fechaInicio.getFullYear()}`;
        let formattedTerminacion = `${meses[fechaTerminacion.getMonth()]} ${fechaTerminacion.getDate()} DE ${fechaTerminacion.getFullYear()}`;
        row += `<tr>
            <td>${formattedInicio}</td>
            <td>${formattedTerminacion}</td>
        </tr>`
    });
    table.innerHTML=rowPrinpal+row
}


function borrarFecha(){
    if(fechas.length == 0){
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
    }else{
        fechas.pop()
        readFechas()
        if(fechas.length == 0){
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
    }
}