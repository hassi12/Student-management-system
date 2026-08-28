from django.urls import path
from .views import mark_attendance, start_attendance, face_mark_attendance

urlpatterns = [
    path("mark/", mark_attendance),
    path("start/", start_attendance),
    path("face-mark/", face_mark_attendance),
]