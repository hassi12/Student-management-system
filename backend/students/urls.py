from django.urls import path
from .views import StudentListCreateView, MyStudentProfileView

urlpatterns = [
    path("", StudentListCreateView.as_view(), name="student-list-create"),
    path("me/", MyStudentProfileView.as_view(), name="my-student-profile"),
]