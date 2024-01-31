from django.shortcuts import render,redirect
from app_nsb_certificaciones.models import *
from django.contrib.auth.hashers import check_password
from django.conf import settings
import requests
from django.db import transaction
from django.contrib import auth
# Create your views here.


#------------------------vistas------------------------#
def vistaLogin(request):
    return render(request,'login.html')


def vistaRegistroUsario(request):
    return render(request,'registrodeusuario.html')

def vistaInicioUsuario(request):
    if request.user.is_authenticated:
        return render(request,'usuario/inicioUsuario.html')
    
def vistaInicioAdministrador(request):
    if request.user.is_authenticated:
        return render(request,'administrador/inicioAdministrador.html')


#------------------------funciones------------------------#

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