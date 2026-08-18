from django.db import models


class Course(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=150)

    department = models.ForeignKey(
        "students.Department",
        on_delete=models.PROTECT
    )

    semester = models.ForeignKey(
        "students.Semester",
        on_delete=models.PROTECT
    )

    credit_hours = models.PositiveIntegerField(default=3)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Enrollment(models.Model):
    student = models.ForeignKey(
        "accounts.StudentProfile",
        on_delete=models.CASCADE
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE
    )

    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "course")

    def __str__(self):
        return f"{self.student.roll_number} - {self.course.code}"