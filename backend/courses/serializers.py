from rest_framework import serializers
from .models import Enrollment


class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source="student.user.get_full_name",
        read_only=True
    )

    roll_number = serializers.CharField(
        source="student.roll_number",
        read_only=True
    )

    course_code = serializers.CharField(
        source="course_offering.course.code",
        read_only=True
    )

    course_name = serializers.CharField(
        source="course_offering.course.name",
        read_only=True
    )

    teacher_name = serializers.CharField(
        source="course_offering.teacher.get_full_name",
        read_only=True
    )

    class_section_name = serializers.CharField(
        source="course_offering.class_section.name",
        read_only=True
    )

    def validate(self, data):
        student = data["student"]
        course_offering = data["course_offering"]

        if student.class_section != course_offering.class_section:
            raise serializers.ValidationError(
                "Student and Course Offering must belong to the same class section."
            )

        return data

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student",
            "student_name",
            "roll_number",
            "course_offering",
            "course_code",
            "course_name",
            "teacher_name",
            "class_section_name",
            "enrolled_at",
        ]
        read_only_fields = ["enrolled_at"]