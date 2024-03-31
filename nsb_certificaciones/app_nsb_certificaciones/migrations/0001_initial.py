# Generated by Django 5.0.1 on 2024-03-31 21:43

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Empleado',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('empNombre', models.CharField(db_comment='Nombre del empleado', max_length=100)),
                ('empCedula', models.CharField(db_comment='Numero de cedula del empleado', max_length=20, unique=True)),
                ('empCargo', models.CharField(db_comment='Cargo del empleado', max_length=100)),
                ('empFechas', models.TextField(db_comment='Fechas asociadas al empleado')),
                ('empFechaHoraCreacion', models.DateTimeField(auto_now_add=True, db_comment='Fecha y hora del registro')),
                ('empFechaHoraActualizacion', models.DateTimeField(auto_now=True, db_comment='Fecha y hora última actualización')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('userCedula', models.CharField(db_comment='Numero de cedula del usuario', max_length=20, unique=True)),
                ('userTelefono', models.CharField(db_comment='Numero de telefono del usuario', max_length=20)),
                ('userFoto', models.FileField(blank=True, db_comment='Foto del Usuario', null=True, upload_to='fotos/')),
                ('userFechaHoraCreacion', models.DateTimeField(auto_now_add=True, db_comment='Fecha y hora del registro')),
                ('userFechaHoraActualizacion', models.DateTimeField(auto_now=True, db_comment='Fecha y hora última actualización')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Certificado',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cerNombre', models.CharField(db_comment='Nombre del certificado', max_length=100)),
                ('cerCantidadGenerada', models.BigIntegerField(db_comment='Cantidad de veces que se ha generado este certificado')),
                ('cerFechaHoraCreacion', models.DateTimeField(auto_now_add=True, db_comment='Fecha y hora del registro')),
                ('cerFechaHoraActualizacion', models.DateTimeField(auto_now=True, db_comment='Fecha y hora última actualización')),
                ('cerUser', models.ForeignKey(db_comment='Usuario que crea el certificado', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('cerEmpleado', models.ForeignKey(db_comment='Empleado al que pertenece el certificado', on_delete=django.db.models.deletion.CASCADE, to='app_nsb_certificaciones.empleado')),
            ],
        ),
    ]
