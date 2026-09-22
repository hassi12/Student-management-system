
from rest_framework import serializers

from .models import Quiz, Question, QuizAttempt


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question

        fields = [
            "id",
            "quiz",
            "question_text",
            "question_type",
            "option_a",
            "option_b",
            "option_c",
            "option_d",
            "correct_answer",
            "marks",
        ]

        read_only_fields = [
            "id",
        ]

class StudentQuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question

        fields = [
            "id",
            "quiz",
            "question_text",
            "question_type",
            "option_a",
            "option_b",
            "option_c",
            "option_d",
            "marks",
        ]

        read_only_fields = [
            "id",
            "quiz",
            "marks",
        ]



class QuizSerializer(serializers.ModelSerializer):

    questions = QuestionSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Quiz

        fields = [
            "id",
            "course_offering",
            "title",
            "number_of_questions",
            "time_limit",
            "published",
            "created_at",
            "questions",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]


class QuizAttemptSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuizAttempt

        fields = [
            "id",
            "quiz",
            "student",
            "started_at",
            "completed_at",
            "score",
        ]

        read_only_fields = [
            "id",
            "student",
            "started_at",
            "completed_at",
            "score",
        ]
