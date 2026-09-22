
from django.db import models


class Quiz(models.Model):
  


    course_offering = models.ForeignKey(
    "courses.CourseOffering",
    on_delete=models.CASCADE,
    null=True,
    blank=True
    )

    title = models.CharField(max_length=200)

    number_of_questions = models.PositiveIntegerField(
        default=10
    )

    time_limit = models.PositiveIntegerField(
        help_text="Time limit in minutes"
    )
    published = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title


class Question(models.Model):

    QUESTION_TYPES = (
        ("mcq", "Multiple Choice"),
        ("true_false", "True / False"),
        ("fill_blank", "Fill in the Blank"),
    )

    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name="questions"
    )

    question_text = models.TextField()

    question_type = models.CharField(
        max_length=20,
        choices=QUESTION_TYPES,
        default="mcq"
    )

    # Used for MCQ questions
    option_a = models.CharField(
        max_length=500,
        blank=True
    )

    option_b = models.CharField(
        max_length=500,
        blank=True
    )

    option_c = models.CharField(
        max_length=500,
        blank=True
    )

    option_d = models.CharField(
        max_length=500,
        blank=True
    )

    # For MCQ: A, B, C or D
    # For True/False: True or False
    # For Fill in the Blank: the expected answer
    correct_answer = models.CharField(
        max_length=500
    )

    marks = models.FloatField(
        default=1
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

    started_at = models.DateTimeField(
        auto_now_add=True
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    score = models.FloatField(
        null=True,
        blank=True
    )

    def __str__(self):
        return (
            f"{self.student.roll_number} - "
            f"{self.quiz.title}"
        )
