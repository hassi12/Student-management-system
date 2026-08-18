from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("teacher", "Teacher"),
        ("student", "Student"),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="student"
    )

    def __str__(self):
        return self.username

    
class StudentProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="student_profile"
    )

    roll_number = models.CharField(
        max_length=50,
        unique=True
    )

    department = models.ForeignKey(
        "students.Department",
        on_delete=models.PROTECT
    )

    batch = models.ForeignKey(
        "students.Batch",
        on_delete=models.PROTECT
    )

    semester = models.ForeignKey(
        "students.Semester",
        on_delete=models.PROTECT
    )

    def __str__(self):
        return f"{self.roll_number} - {self.user.get_full_name()}"