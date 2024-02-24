from django.db import models
from django.contrib.auth.models import AbstractUser

cargoEmpleado = [
    ('MADRE COMUNITARIA','MADRE COMUNITARIA'),
    ('PADRE COMUNITARIO','PADRE COMUNITARIO'),
    ('PROFESIONAL EN SALUD Y NUTRICIÓN','PROFESIONAL EN SALUD Y NUTRICIÓN'),
    ('PROFESIONAL PSICOSOCIAL','PROFESIONAL PSICOSOCIAL'),
    ('AGENTE EDUCATIVO/DOCENTE','AGENTE EDUCATIVO/DOCENTE'),
    ('AUXILIAR PEDAGÓGICO','AUXILIAR PEDAGÓGICO'),
    ('MANIPULADOR DE ALIMENTOS','MANIPULADOR DE ALIMENTOS'),
    ('AUXILIAR DE SERVICIOS GENERALES','AUXILIAR DE SERVICIOS GENERALES'),
    ('COORDINADOR (A)','COORDINADOR (A)')
]

class User(AbstractUser):
    userCedula = models.CharField(
        max_length=20,unique=True,
        db_comment="Numero de cedula del usuario",
        )
    userTelefono = models.CharField(max_length=20,db_comment="Numero de telefono del usuario")
    userFoto = models.FileField(upload_to=f"fotos/", null=True, blank=True,db_comment="Foto del Usuario")
    userFechaHoraCreacion  = models.DateTimeField(auto_now_add=True,db_comment="Fecha y hora del registro")
    userFechaHoraActualizacion = models.DateTimeField(auto_now=True,db_comment="Fecha y hora última actualización")
    def _str_(self):
        return f"{self.username}"
    
class FechasContrato(models.Model):
    fecInicio = models.DateField()
    fecTerminacion = models.DateField()
    fecFechaHoraCreacion  = models.DateTimeField(auto_now_add=True,db_comment="Fecha y hora del registro")
    fecFechaHoraActualizacion = models.DateTimeField(auto_now=True,db_comment="Fecha y hora última actualización")
class Empleado(models.Model):
    empNombre = models.CharField(max_length=100,db_comment="Nombre del empleado")
    empCedula = models.CharField(max_length=20,db_comment="Numero de cedula del empleado")
    empCargo = models.CharField(max_length=100,choices=cargoEmpleado,db_comment="Cargo del empleado")
    empFechasContrato = models.ForeignKey(FechasContrato,on_delete=models.CASCADE,db_comment="Fechas de los contratos que ha tenido el empleado")
    empFechaHoraCreacion  = models.DateTimeField(auto_now_add=True,db_comment="Fecha y hora del registro")
    empFechaHoraActualizacion = models.DateTimeField(auto_now=True,db_comment="Fecha y hora última actualización")   
class Certificado(models.Model):
    cerNombre = models.CharField(max_length=100,db_comment="Nombre del certificado")
    cerEmpleado = models.ForeignKey(Empleado, on_delete=models.CASCADE,db_comment="Empleado al que pertenece el certificado")
    cerUser = models.ForeignKey(User, on_delete=models.CASCADE,db_comment="Usuario que crea el certificado")
    cerFechaHoraCreacion  = models.DateTimeField(auto_now_add=True,db_comment="Fecha y hora del registro")
    cerFechaHoraActualizacion = models.DateTimeField(auto_now=True,db_comment="Fecha y hora última actualización")