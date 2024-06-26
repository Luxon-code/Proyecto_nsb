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
let existeEmpleado = false
let idEmpleado = ""

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
            data.append('existeEmpleado',existeEmpleado)
            data.append('idEmpleado',idEmpleado)
            data.append('tipoContrato',document.querySelector('input[name="tipoContrato"]:checked').value)
            data.append('Firma',document.querySelector('input[name="Firma"]:checked').value)
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
                        limpiarFormulario()
                        loader.style.display = "none";
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

function empleadoSeleccionado(element) {
    existeEmpleado = true;
    idEmpleado = element.id;
    document.getElementById("listProyectos").innerHTML = "";
    document.getElementById("listProyectos").style  = ``;
    console.log(element)
    fechas = JSON.parse(element.empFechas)
    readFechas()
    txtNombre.value = element.empNombre
    txtCedula.value = element.empCedula
    cbCargo.value = element.empCargo
    if(TerminoFijo.value==element.empTipoContrato){
        TerminoFijo.checked = true
    }else{
        PrestacionServicio.checked = true
    }
    radioButton()
    $('#nombreCompleto').removeClass()
    $('#nombreCompleto').text(element.empNombre)
    $('#cedula').removeClass()
    $('#cedula').text(element.empCedula)
    $('#cargo').removeClass()
    $('#cargo').text(element.empCargo)
    txtCedula.disabled = true
    fechaMinima()
    block_impiar.innerHTML = `<div class="col-lg-10">
    <button class="button" onclick="limpiarFormulario()" type="button"> <span>limpiar formalario <i class="fa-solid fa-eraser fa-beat"></i></span>
    </button>
  </div>`
}

function limpiarFormulario(){
    existeEmpleado = false;
    idEmpleado = null;
    fechas = []
    defaultTable()
    txtNombre.value = ''
    txtCedula.value = ''
    cbCargo.value = ''
    $('#nombreCompleto').addClass('placeholder col-6 placeholder-sm')
    $('#nombreCompleto').text('')
    $('#cedula').addClass('placeholder col-3 placeholder-sm')
    $('#cedula').text('')
    $('#cargo').addClass('placeholder col-3 placeholder-sm')
    $('#cargo').text('')
    txtCedula.disabled = false
    fechaMinima()
    block_impiar.innerHTML = ``
    cbxFirma.checked = true
    TerminoFijo.checked = true
}

function radioButton(){
    let elementoActivo = document.querySelector('input[name="tipoContrato"]:checked');
    if(elementoActivo) {
        tipoContrato.innerHTML = elementoActivo.value;
    } else {
        alert('No hay ninún elemento activo');
    }
}