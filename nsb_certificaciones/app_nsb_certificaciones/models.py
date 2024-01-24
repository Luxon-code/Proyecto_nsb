from django.db import models
from django.contrib.auth.models import AbstractUser

cargoEmpleado = [
    ('Madre comunitaria','Madre comunitaria'),
    ('Docente','Docente'),
    ('Padre comunitario','Padre comunitario'),
    ('Auxiliar administrativo','Auxiliar administrativo'),
]

class User(AbstractUser):
    userCedula = models.CharField(
        max_length=20,unique=True,
        db_comment="Numero de cedula del usuario",
        )
    userTelefono = models.CharField(max_length=20,db_comment="Numero de telefono del usuario")
    userFoto = models.FileField(upload_to=f"fotos/", null=True, blank=True,db_comment="Foto del Usuario")
    userfechaHoraCreacion  = models.DateTimeField(auto_now_add=True,db_comment="Fecha y hora del registro")
    userfechaHoraActualizacion = models.DateTimeField(auto_now=True,db_comment="Fecha y hora última actualización")
    def _str_(self):
        return f"{self.username}"
    
class Empleado(models.Model):
    empNombre = models.CharField(max_length=100,db_comment="Nombre del empleado")
    empCedula = models.CharField(max_length=20,db_comment="Numero de cedula del empleado")
    empCargo = models.CharField(max_length=100,choices=cargoEmpleado,db_comment="Cargo del empleado")
    empFechaHoraCreacion  = models.DateTimeField(auto_now_add=True,db_comment="Fecha y hora del registro")
    empFechaHoraActualizacion = models.DateTimeField(auto_now=True,db_comment="Fecha y hora última actualización")
    
class Certificado(models.Model):
    cerNombre = models.CharField(max_length=100,db_comment="Nombre del certificado")
    cerEmpleado = models.ForeignKey(Empleado, on_delete=models.CASCADE,db_comment="Empleado al que pertenece el certificado")
    cerUser = models.ForeignKey(User, on_delete=models.CASCADE,db_comment="Usuario que crea el certificado")
    cerFechaHoraCreacion  = models.DateTimeField(auto_now_add=True,db_comment="Fecha y hora del registro")
    cerFechaHoraActualizacion = models.DateTimeField(auto_now=True,db_comment="Fecha y hora última actualización")
    
