from django.shortcuts import render

# Create your views here.

def vistaLogin(request):
    return render(request,'login.html')


def vistaRegistroUsario(request):
    return render(request,'registrodeusuario.html')
