
from django.contrib import admin

from .models import Quiz, Question, QuizAttempt



@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "course_offering",
        "number_of_questions",
        "time_limit",
        "published",
        "created_at",
    )

    list_filter = (
        "published",
        "course_offering",
    )

    search_fields = (
        "title",
    )



@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):

    list_display = (
        "question_text",
        "quiz",
        "question_type",
        "marks",
    )

    list_filter = (
        "question_type",
        "quiz",
    )


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):

    list_display = (
        "quiz",
        "student",
        "started_at",
        "completed_at",
        "score",
    )
