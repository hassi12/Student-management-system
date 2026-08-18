from django.db import models


class Assignment(models.Model):
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    due_date = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Submission(models.Model):
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE
    )

    student = models.ForeignKey(
        "accounts.StudentProfile",
        on_delete=models.CASCADE
    )

    file = models.FileField(upload_to="assignments/")

    submitted_at = models.DateTimeField(auto_now_add=True)

    marks = models.FloatField(null=True, blank=True)

    feedback = models.TextField(blank=True)

    def __str__(self):
        return f"{self.student.roll_number} - {self.assignment.title}"