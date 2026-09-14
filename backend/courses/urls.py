from django.urls import path
from .views import EnrollmentListCreateView, MyEnrollmentsView

urlpatterns = [
    path("", EnrollmentListCreateView.as_view(), name="enrollment-list-create"),
    path("my/", MyEnrollmentsView.as_view(), name="my-enrollments"),
]