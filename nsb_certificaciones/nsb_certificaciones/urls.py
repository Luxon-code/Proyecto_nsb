"""
URL configuration for nsb_certificaciones project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from app_nsb_certificaciones import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.vistaLogin),
    path('vistaregistrarUsuario/',views.vistaRegistroUsario),
    path('registrarUsuario/',views.registrarUsuario),
    path('inicioUsuario/',views.vistaInicioUsuario),
    path('inicioAdministrador/',views.vistaInicioAdministrador),
    path('iniciarSesion/',views.iniciarSesion),
    path('cerrarSesion/',views.cerrarSesion),
    path('generarCertificado/',views.generarCertificado),
    path('obtenerEmpleados/',views.obtenerEmpleados),
    path('actualizarPerfil/<int:id>',views.actualizarPerfil),
    path('vistaActualizarPerfil/',views.vistaActulizarPefil),
    path('vistaHistorialCertificaciones/',views.vistaHistorialCertificaciones),
    path('vistaAdministrarUsuarios/',views.vistaAdministrarUsuarios),
    path('cambiarEstadoUsuario/<int:id>',views.cambiarEstadoUsuario),
    path('obtenerUsuario/<int:id>',views.obtenerUsario),
    path('reset_password/',auth_views.PasswordResetView.as_view(template_name='recuperarPassword/PasswordResetView.html'),name='password_reset'),
    path('reset_password_send/',auth_views.PasswordResetDoneView.as_view(template_name='recuperarPassword/PasswordResetDoneView.html'),name='password_reset_done'),
    path('reset/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(template_name='recuperarPassword/PasswordResetConfirmView.html'),name='password_reset_confirm'),
    path('reset_password_complete/',auth_views.PasswordResetCompleteView.as_view(template_name='recuperarPassword/PasswordResetCompleteView.html'),name='password_reset_complete'),
]


if settings.DEBUG:
    urlpatterns += static (settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
