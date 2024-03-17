from django.shortcuts import render,redirect
from app_nsb_certificaciones.models import *
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from django.conf import settings
import requests
from nlt import numlet as nl
import os
from django.db import transaction
from django.contrib import auth
import datetime
# Create your views here.


#------------------------vistas------------------------#
def vistaLogin(request):
    return render(request,'login.html')


def vistaRegistroUsario(request):
    return render(request,'registrodeusuario.html')

def vistaInicioUsuario(request):
    if request.user.is_authenticated:
        return render(request,'usuario/inicioUsuario.html',{"usuario":request.user,"cargos":cargoEmpleado,"fechaActual":fecha_actual()})
    else:
        return render(request,'login.html',{"mensaje":"Debe iniciar sesion para acceder a esta pagina"})
    
def vistaInicioAdministrador(request):
    if request.user.is_authenticated:
        return render(request,'administrador/inicioAdministrador.html')


#------------------------funciones------------------------#
def fecha_actual():
    meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    ahora = datetime.datetime.now()
    dia = ahora.day
    mes = meses[ahora.month - 1]
    año = ahora.year
    año_letras = nl.Numero(año).a_letras.lower()
    return f"Dado en Neiva a solicitud de la interesada,a los ({dia}) días del mes {mes} de {año_letras}  ({año})."

def registrarUsuario(request):
    """
    Registra un nuevo usuario en el sistema.

    Args:
        request (HttpRequest): La solicitud HTTP que contiene la información del usuario a registrar.

    Returns:
        HttpResponse: Una respuesta HTTP que generalmente redirige al usuario a una página de registro o muestra un mensaje de éxito o error.
    """
    try:
        cedula = request.POST["txtCedula"]
        nombres = request.POST["txtNombres"]
        apellidos = request.POST["txtApellidos"]
        correo = request.POST["txtCorreo"]
        telefono = request.POST["txtTelefono"]
        foto = request.FILES.get("fileFoto")
        contraseña = request.POST["txtContraseña"]
        with transaction.atomic():
            # crear un objeto de tipo User
            user = User(username=correo, first_name=nombres,
                        last_name=apellidos,userFoto=foto,userCedula=cedula,userTelefono=telefono,email=correo)
            user.save()
            
            user.set_password(contraseña)
            # se actualiza el user
            user.save()
            mensaje = "Usuario Registrado Correctamente"
            retorno = {"mensaje": mensaje,"estado":True}
    except Exception as error:
        transaction.rollback()
        if 'userCedula' in str(error):
            mensaje = "Ya existe un usuario con esta cedula"
        elif 'user.username' in str(error):
            mensaje = "Ya existe un usuario con este correo electronico"
        else:
            mensaje = error
        retorno = {"mensaje": mensaje,"estado":False,
                "cedula" : cedula,"nombres" : nombres,"apellidos" : apellidos,
                "correo" : correo,"telefono" : telefono
                }
    return render(request, "registrodeusuario.html",retorno)

def iniciarSesion(request):
    """
    Maneja el inicio de sesión de usuarios en el sistema.

    Args:
        request (HttpRequest): La solicitud HTTP recibida.

    Returns:
        HttpResponse: Una respuesta HTTP que redirige al usuario a la página de inicio correspondiente o muestra un mensaje de error.
    """
    if request.method == 'POST':
        recaptcha_token = request.POST.get('recaptchaToken')
        response = requests.post('https://www.google.com/recaptcha/api/siteverify', data={
            'secret': settings.GOOGLE_RECAPTCHA_SECRET_KEY,
            'response': recaptcha_token
        })

        if response.json().get('success') == True:
            username = request.POST["txtUsuario"]
            password = request.POST["txtContraseña"]
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                mensaje = "No existe un usuario con este correo electronico"
                return render(request, "login.html", {"mensaje": mensaje})
            
            if check_password(password, user.password):
                if user.is_active:
                    auth.login(request, user)
                    if user.is_superuser:
                        return redirect('/inicioAdministrador/')
                    else:
                        return redirect('/inicioUsuario/')
                else:
                    mensaje = "Su usuario no esta activo"
                    return render(request, "login.html", {"mensaje": mensaje})
            else:
                mensaje = "la contraseña es incorrecta"
                return render(request, "login.html", {"mensaje": mensaje})
        else:
            mensaje = "validar recapcha"
            return render(request, "login.html", {"mensaje": mensaje})
        
def cerrarSesion(request):
    """
    Cierra la sesión de un usuario en el sistema.

    Args:
        request (HttpRequest): La solicitud HTTP recibida.

    Returns:
        HttpResponse: Una respuesta HTTP que redirige al usuario a la página de inicio de sesión.
    """
    auth.logout(request)
    return render(request, "login.html", {"mensaje": "Sesion cerrada correctamente"})


def generarCertificado(request):
    if request.method == "POST":
        estado = False
        try:
            with transaction.atomic():
                nombreCompleto = request.POST.get('nombreCompleto')
                cedula = request.POST.get('cedula')
                cargo = request.POST.get('cargo')
                fechas =request.POST.get('fechas')
                existeEmpleado = request.POST.get('existeEmpleado')
                idEmpleado = request.POST.get('idEmpleado')
                if existeEmpleado=="true":
                    empleado = Empleado.objects.get(pk=idEmpleado)
                    empleado.empNombre = nombreCompleto
                    empleado.empCedula = cedula
                    empleado.empCargo = cargo
                    empleado.empFechas = fechas
                    empleado.save()
                    certificado = Certificado.objects.filter(cerEmpleado=empleado).get()
                    url = pdfCertificado(empleado,certificado)
                    nombreDelArchivo=certificado.cerNombre
                    mensaje="Certificado Generado"
                    estado=True
                else:
                    empleado = Empleado(empNombre=nombreCompleto,empCedula=cedula,empCargo=cargo,
                                        empFechas=fechas)
                    empleado.save()
                    certificado = Certificado(cerNombre=f"{cedula}_{nombreCompleto}",cerEmpleado=empleado,
                                            cerUser=request.user)
                    certificado.save()
                    url = pdfCertificado(empleado,certificado)
                    nombreDelArchivo=certificado.cerNombre
                    mensaje="Certificado Generado"
                    estado=True
                retorno = {"estado": estado, "mensaje": mensaje,"url":'/'+url,"nombreDelArhivo":nombreDelArchivo}
        except Exception as error:
            transaction.rollback()
            mensaje = f"{error}"
            if 'empleado.empCedula' in str(error):
                mensaje = "ya existe un empleado con esta cedula"
            retorno = {"estado": estado, "mensaje": mensaje}
        return JsonResponse(retorno)
    
def pdfCertificado(empleado: Empleado, certificado: Certificado):
    eliminar_archivos_pdf()
    from app_nsb_certificaciones.certificadoPdf import CertificadoPdf
    pdf = CertificadoPdf()
    
    pdf.add_page()
    
    pdf.mostrarDatos(empleado)
    
    pdf_output_path = f'media/{certificado.cerNombre}.pdf'
    pdf.output(pdf_output_path, 'F')
    return pdf_output_path

def eliminar_archivos_pdf():
    directorio_media = 'media'  # Reemplaza 'ruta/a/la/carpeta/media' con la ruta real a tu carpeta media

    # Recorre todos los archivos en la carpeta media
    for nombre_archivo in os.listdir(directorio_media):
        # Verifica si el archivo es un archivo PDF
        if nombre_archivo.endswith('.pdf'):
            # Construye la ruta completa al archivo
            ruta_archivo = os.path.join(directorio_media, nombre_archivo)
            try:
                # Intenta eliminar el archivo
                os.remove(ruta_archivo)
                print(f"Archivo eliminado: {ruta_archivo}")
            except Exception as e:
                print(f"No se pudo eliminar el archivo {ruta_archivo}: {e}")
                
def obtenerEmpleados(request):
    try:
        retorno = {
            "empleados":list(Empleado.objects.all().values())
        }
        return JsonResponse(retorno)
    except Exception as e:
        print("Error: "+e)
