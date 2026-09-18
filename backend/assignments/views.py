from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import models
from django.utils import timezone

from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer
from rest_framework.exceptions import PermissionDenied
from courses.models import CourseOffering

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

    # Check if the student already has a submission
    existing_submission = Submission.objects.filter(
        assignment=assignment,
        student=student
    ).first()

    # Do not allow changes after submission
    if existing_submission:
        if existing_submission.status in ["submitted", "graded"]:
            raise PermissionDenied(
                "This assignment has already been submitted and cannot be changed."
            )

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


class SubmitAssignmentView(generics.UpdateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        assignment_id = self.kwargs["assignment_id"]

        student = self.request.user.student_profile

        return Submission.objects.get(
            assignment_id=assignment_id,
            student=student
        )

    def update(self, request, *args, **kwargs):
        submission = self.get_object()

        submission.status = "submitted"
        submission.submitted_at = timezone.now()
        submission.save()

        serializer = self.get_serializer(submission)

        return Response(serializer.data)


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



class AssignmentSubmissionsView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        assignment_id = self.kwargs["assignment_id"]

        assignment = Assignment.objects.get(
            id=assignment_id
        )

        user = self.request.user

        # Only teachers can view student submissions
        if user.role != "teacher":
            raise PermissionDenied(
                "Only teachers can view assignment submissions."
            )

        # Check that this teacher teaches the assignment's course
        is_teacher = CourseOffering.objects.filter(
            course=assignment.course,
            teacher=user
        ).exists()

        if not is_teacher:
            raise PermissionDenied(
                "You are not authorized to view these submissions."
            )

        return Submission.objects.filter(
            assignment=assignment
        ).select_related("student")


class SubmissionDetailView(generics.RetrieveAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        submission_id = self.kwargs["submission_id"]

        submission = Submission.objects.select_related(
            "student",
            "student__user",
            "assignment"
        ).get(
            id=submission_id
        )

        user = self.request.user

        # Only teachers can view individual submissions
        if user.role != "teacher":
            raise PermissionDenied(
                "Only teachers can view student submissions."
            )

        # Teacher must teach the course of this assignment
        is_teacher = CourseOffering.objects.filter(
            course=submission.assignment.course,
            teacher=user
        ).exists()

        if not is_teacher:
            raise PermissionDenied(
                "You are not authorized to view this submission."
            )

        return submission

class GradeSubmissionView(generics.UpdateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        submission_id = self.kwargs["submission_id"]

        submission = Submission.objects.select_related(
            "assignment"
        ).get(
            id=submission_id
        )

        user = self.request.user

        # Only teachers can grade submissions
        if user.role != "teacher":
            raise PermissionDenied(
                "Only teachers can grade submissions."
            )

        # Teacher must teach the assignment's course
        is_teacher = CourseOffering.objects.filter(
            course=submission.assignment.course,
            teacher=user
        ).exists()

        if not is_teacher:
            raise PermissionDenied(
                "You are not authorized to grade this submission."
            )

        return submission

    def update(self, request, *args, **kwargs):
        submission = self.get_object()

        serializer = self.get_serializer(
            submission,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)

        submission.marks = serializer.validated_data.get(
            "marks",
            submission.marks
        )

        submission.feedback = serializer.validated_data.get(
            "feedback",
            submission.feedback
        )

        submission.status = "graded"

        submission.save()

        return Response(
            self.get_serializer(submission).data
        )
