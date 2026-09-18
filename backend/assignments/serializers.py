
from rest_framework import serializers

from .models import Assignment, Submission


class AssignmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Assignment
        fields = "__all__"



class SubmissionSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.user.first_name",
        read_only=True
    )

    student_roll_number = serializers.CharField(
        source="student.roll_number",
        read_only=True
    )

    class Meta:
        model = Submission

        fields = [
            "id",
            "assignment",
            "student",
            "student_name",
            "student_roll_number",
            "answer",
            "file",
            "submitted_at",
            "status",
            "marks",
            "feedback",
        ]

        read_only_fields = [
            "student",
            "student_name",
            "student_roll_number",
            "submitted_at",
            "status",
        ]

    def validate_marks(self, value):
        assignment = self.instance.assignment if self.instance else None

        if assignment and value > assignment.max_marks:
            raise serializers.ValidationError(
                f"Marks cannot be greater than "
                f"{assignment.max_marks}."
            )

        if value < 0:
            raise serializers.ValidationError(
                "Marks cannot be negative."
            )

        return value
