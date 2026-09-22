
from django.urls import path

from .views import (
    QuizListCreateView,
    QuizDetailView,
    QuestionListCreateView,
    QuestionDetailView,
    QuizAttemptListCreateView,
)


urlpatterns = [

    # Quizzes
    path(
        "",
        QuizListCreateView.as_view(),
        name="quiz-list-create"
    ),

    path(
        "<int:pk>/",
        QuizDetailView.as_view(),
        name="quiz-detail"
    ),

    # Questions
    path(
        "<int:quiz_id>/questions/",
        QuestionListCreateView.as_view(),
        name="question-list-create"
    ),

    path(
        "<int:quiz_id>/questions/<int:pk>/",
        QuestionDetailView.as_view(),
        name="question-detail"
    ),

    # Quiz attempts
    path(
        "attempts/",
        QuizAttemptListCreateView.as_view(),
        name="quiz-attempt-list-create"
    ),
]
