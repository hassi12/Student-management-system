from rest_framework import generics
from .models import Enrollment
from .serializers import EnrollmentSerializer


class EnrollmentListCreateView(generics.ListCreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer