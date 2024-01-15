from django.shortcuts import render

# Create your views here.

def vistaLogin(request):
    return render(request,'login.html')
