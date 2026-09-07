from rest_framework import serializers
from django.contrib.auth import get_user_model
from accounts.models import StudentProfile


User = get_user_model()


class StudentProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)

    department_name = serializers.CharField(
        source="department.name",
        read_only=True
    )

    batch_name = serializers.CharField(
        source="batch.name",
        read_only=True
    )

    semester_name = serializers.CharField(
        source="semester.name",
        read_only=True
    )

    class_section_name = serializers.CharField(
        source="class_section.name",
        read_only=True
    )

    class Meta:
        model = StudentProfile
        fields = [
            "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "roll_number",
            "department",
            "department_name",
            "batch",
            "batch_name",
            "semester",
            "semester_name",
            "class_section",
            "class_section_name",
        ]

    def create(self, validated_data):
        username = validated_data.pop("username")
        password = validated_data.pop("password")
        first_name = validated_data.pop("first_name")
        last_name = validated_data.pop("last_name")

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role="student"
        )

        return StudentProfile.objects.create(
            user=user,
            **validated_data
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["username"] = instance.user.username
        data["first_name"] = instance.user.first_name
        data["last_name"] = instance.user.last_name

        return data