from django.urls import path

from .views import (
    AssignmentListView,
    AssignmentDetailView,
    SubmissionCreateView,
    MySubmissionView,
)

urlpatterns = [
    path("", AssignmentListView.as_view(), name="assignment-list"),

    path(
        "<int:pk>/",
        AssignmentDetailView.as_view(),
        name="assignment-detail",
    ),

    path(
        "submit/",
        SubmissionCreateView.as_view(),
        name="submission-create",
    ),

    path(
        "<int:assignment_id>/my-submission/",
        MySubmissionView.as_view(),
        name="my-submission",
    ),
]