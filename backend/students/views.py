from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from accounts.models import StudentProfile
from .serializers import StudentProfileSerializer


class StudentListCreateView(generics.ListCreateAPIView):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]