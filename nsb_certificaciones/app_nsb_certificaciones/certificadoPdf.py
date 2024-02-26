from fpdf import FPDF
from app_nsb_certificaciones.models import *
from app_nsb_certificaciones.views import fecha_actual
from datetime import datetime


def formatearFechas(fecha):
    meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", 
             "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", 
             "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]
    fecha=datetime.strptime(fecha, "%Y-%m-%d")
    
    return f"{meses[fecha.month - 1]} {fecha.day} DE {fecha.year}"
    
class CertificadoPdf(FPDF):
    def header(self):
        with self.local_context(fill_opacity=0.25):
            # Logo
            self.image('media/nsb_logo.jpg', 10, 8, 20)
            # Arial bold 13
            self.set_font('Arial', 'B', 13)
            self.ln()
            # Move to the right
            self.cell(60)
            # Title
            self.cell(80, 10, 'CORPORACIÓN NUTRICIÓN SALUD Y BIENESTAR NSB DE COLOMBIA', 0, 0, 'C')  # Agrega el parámetro fill=True para aplicar el color de fondo
            self.ln(5)
            self.set_font('Arial','B',11)
            self.cell(60)
            self.cell(80, 10, "NIT 900.407.911-8", 0, 0, 'C')
            # Line break
            self.ln(20)
        
    def footer(self):
        with self.local_context(fill_opacity=0.25):
            # Pie de página del PDF
            self.set_y(-15)
            self.set_font('Arial', '', 8)
            self.cell(0, 10, "CALLE 4 No. 10-11 Barrio Altico Neiva - Huila", 0, 0, 'C')
            self.ln(5)
            self.set_font('Arial', '', 6)
            self.cell(0, 10, "Teléfono 8641144 / 3208033640", 0, 0, 'C')
        
    def mostrarDatos(self,empleado:Empleado):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, "LA SUSCRITA REPRESENTANTE LEGAL", 0, 0, 'C')
        self.ln(15)
        self.cell(0, 10, "CERTIFICA QUE", 0,0, 'C')
        self.ln(15)
        self.set_font('Arial','',12)
        text = (f"**{empleado.empNombre.upper()}** Identificado/a con cedula de ciudadanía número "
        f"**{empleado.empCedula}**, quien viene laborando para la Corporación mediante "
        f"contrato de Trabajo a Término Fijo, inferior a un año relacionado a continuación:")
        self.multi_cell(0,10,text,markdown=True,align="J",max_line_height=5,padding=5)
        self.ln()
        #tabla
        ancho_pagina = self.w
        # Ancho de la tabla
        ancho_tabla = 150  # Ajusta este valor según tus necesidades
        # Calcula la posición x inicial para centrar la tabla
        x_inicial = (ancho_pagina - ancho_tabla) / 2
        # Establece la posición x inicial para la primera celda de la tabla
        self.set_x(x_inicial)
        # Crear la tabla
        self.set_font("Arial", "B", 11)
        self.cell(150, 10, "CONTRATO", 1, 1, "C")
        self.set_font("Arial", "", 12)
        self.set_x(x_inicial)
        self.cell(75, 10, "FECHA DE INICIO", 1, 0, "C")
        self.cell(75, 10, "FECHA DE TERMINACIÓN", 1, 1, "C")
        for fecha in empleado.obtener_fechas():
            self.set_x(x_inicial)
            self.cell(75, 10,formatearFechas(fecha[0]), 1, 0, "C")
            self.cell(75, 10,formatearFechas(fecha[1]), 1, 1, "C")
        self.ln()
        self.set_font('Arial','',12)
        text = f'Desempeñándose en el cargo de: **{empleado.empCargo}**, en el desarrollo de los Contratos de Aporte mencionados, cuyo objeto es "Atender integralmente a la primera infancia De Cero a Siempre", de conformidad con las directrices, lineamientos y estándares establecidos por el ICBF.'
        self.multi_cell(0,10,text,markdown=True,align="J",max_line_height=5,padding=5)
        self.ln()
        self.multi_cell(0,10,fecha_actual(),markdown=True,align="J",max_line_height=5,padding=5)
        self.ln()
        self.cell(5)
        self.cell(0,10,"Atentamente,",0,1,align="L")
        self.image('media/firma_representante_legal.jpg',x='L',w=80)
        self.set_font('Arial','B',12)
        self.cell(5)
        self.cell(0,10,"MARÍA NAYIBE FERIZ DE VEGA",0,1,align="L")
        self.set_font('Arial','',12)
        self.cell(5)
        self.cell(0,10,"Representante Legal.",0,1,align="L")
        