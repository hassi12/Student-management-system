from django.urls import path
from .views import mark_attendance, start_attendance

urlpatterns = [
    path("mark/", mark_attendance),
    path("start/", start_attendance),
]