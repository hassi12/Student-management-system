from django.db import models


class Assignment(models.Model):
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    due_date = models.DateTimeField()

    max_marks = models.FloatField(default=10)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Submission(models.Model):

    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("graded", "Graded"),
    )

    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE
    )

    student = models.ForeignKey(
        "accounts.StudentProfile",
        on_delete=models.CASCADE
    )

    answer = models.TextField(blank=True)

    file = models.FileField(
        upload_to="assignments/",
        blank=True,
        null=True
    )

    submitted_at = models.DateTimeField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft"
    )

    marks = models.FloatField(
        null=True,
        blank=True
    )

    feedback = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"{self.student.roll_number} - {self.assignment.title}"