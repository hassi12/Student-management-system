
from rest_framework import generics

from rest_framework.permissions import (
    IsAuthenticated,
    BasePermission,
)


from .models import Quiz, Question, QuizAttempt

from .serializers import (
    QuizSerializer,
    QuestionSerializer,
    StudentQuestionSerializer,
    QuizAttemptSerializer,
)




class TeacherOrAdmin(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_staff
            or getattr(request.user, "role", None) in [
                "admin",
                "teacher",
            ]
        )




# -------------------------
# Quiz List / Create
# -------------------------




class QuizListCreateView(generics.ListCreateAPIView):

    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    
    def get_queryset(self):

        user = self.request.user

    # Students can only access
    # published quizzes for their enrolled courses
        if getattr(user, "role", None) == "student":

            return Quiz.objects.filter(
            published=True,
            course_offering__enrollment__student__user=user
        ).distinct()

    # Teachers and admins can access all quizzes
        return Quiz.objects.all()


    def get_permissions(self):

        if self.request.method == "POST":

            return [
                IsAuthenticated(),
                TeacherOrAdmin(),
            ]

        return [
            IsAuthenticated(),
        ]



# -------------------------
# Quiz Detail
# -------------------------


class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):

        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [
                IsAuthenticated(),
                TeacherOrAdmin(),
            ]

        return [
            IsAuthenticated(),
        ]



# -------------------------
# Question List / Create
# -------------------------

class QuestionListCreateView(generics.ListCreateAPIView):

    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    
    def get_queryset(self):

        quiz_id = self.kwargs["quiz_id"]

        user = self.request.user

    # Students can only access questions
    # from published quizzes they are enrolled in
        if getattr(user, "role", None) == "student":

            return Question.objects.filter(
            quiz_id=quiz_id,
            quiz__published=True,
            quiz__course_offering__enrollment__student__user=user
        ).distinct()

    # Teachers and admins can access all questions
        return Question.objects.filter(
        quiz_id=quiz_id
    )


    def get_permissions(self):

        if self.request.method == "POST":
            return [
                IsAuthenticated(),
                TeacherOrAdmin(),
            ]

        return [
            IsAuthenticated(),
        ]

    def get_serializer_class(self):

        if getattr(self.request.user, "role", None) == "student":
         return StudentQuestionSerializer

        return QuestionSerializer

    

# -------------------------
# Question Detail
# -------------------------


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    
    def get_queryset(self):

        quiz_id = self.kwargs["quiz_id"]

        user  = self.request.user

    # Students can only access questions
    # from published quizzes they are enrolled in
        if getattr(user, "role", None) == "student":

            return Question.objects.filter(
            quiz_id=quiz_id,
            quiz__published=True,
            quiz__course_offering__enrollment__student__user=user
        ).distinct()

    # Teachers and admins can access all questions
        return Question.objects.filter(
        quiz_id=quiz_id
    )


    def get_permissions(self):

        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [
                IsAuthenticated(),
                TeacherOrAdmin(),
            ]

        return [
            IsAuthenticated(),
        ]
    
    def get_serializer_class(self):

        if getattr(self.request.user, "role", None) == "student":
            return StudentQuestionSerializer

        return QuestionSerializer



# -------------------------
# Quiz Attempts
# -------------------------

class QuizAttemptListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return QuizAttempt.objects.all()
