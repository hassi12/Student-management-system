from django.db import models


class AttendanceSession(models.Model):
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE
    )

    teacher = models.ForeignKey(
    "accounts.User",
    on_delete=models.CASCADE,
    limit_choices_to={"role": "teacher"},
    null=True,
    blank=True
    )

    date = models.DateField(auto_now_add=True)

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    allowed_radius = models.PositiveIntegerField(
        default=100
    )

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.course.code} - {self.date}"


class AttendanceRecord(models.Model):
    session = models.ForeignKey(
        AttendanceSession,
        on_delete=models.CASCADE
    )

    student = models.ForeignKey(
        "accounts.StudentProfile",
        on_delete=models.CASCADE
    )

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    marked_at = models.DateTimeField(auto_now_add=True)

    is_present = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.roll_number} - {self.session.course.code}"
