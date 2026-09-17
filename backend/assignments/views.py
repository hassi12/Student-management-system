from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer


class AssignmentListView(generics.ListAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]


class AssignmentDetailView(generics.RetrieveAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]


class SubmissionCreateView(generics.CreateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        student = self.request.user.student_profile

        assignment = serializer.validated_data["assignment"]
        answer = serializer.validated_data.get("answer", "")

        submission, created = Submission.objects.update_or_create(
            assignment=assignment,
            student=student,
            defaults={
                "answer": answer,
                "status": "draft",
                "submitted_at": None,
            },
        )

        serializer.instance = submission


class MySubmissionView(generics.RetrieveAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        assignment_id = self.kwargs["assignment_id"]

        student = self.request.user.student_profile

        return Submission.objects.get(
            assignment_id=assignment_id,
            student=student
        )