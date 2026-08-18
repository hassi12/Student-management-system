from django.db import models


class Quiz(models.Model):
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE
    )

    title = models.CharField(max_length=200)

    number_of_questions = models.PositiveIntegerField(default=10)

    time_limit = models.PositiveIntegerField(
        help_text="Time limit in minutes"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name="questions"
    )

    question_text = models.TextField()

    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)

    correct_answer = models.CharField(
        max_length=1,
        choices=[
            ("A", "A"),
            ("B", "B"),
            ("C", "C"),
            ("D", "D"),
        ]
    )

    def __str__(self):
        return self.question_text[:50]

class QuizAttempt(models.Model):
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE
    )

    student = models.ForeignKey(
        "accounts.StudentProfile",
        on_delete=models.CASCADE
    )

    started_at = models.DateTimeField(auto_now_add=True)

    completed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    score = models.FloatField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.student.roll_number} - {self.quiz.title}"
