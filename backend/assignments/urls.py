
from django.urls import path

from .views import (
    AssignmentListView,
    AssignmentDetailView,
    SubmissionCreateView,
    MySubmissionView,
    SubmitAssignmentView,
    AssignmentSubmissionsView,
    SubmissionDetailView,
    GradeSubmissionView,

)


urlpatterns = [
    path(
        "",
        AssignmentListView.as_view(),
        name="assignment-list",
    ),

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

    path(
        "<int:assignment_id>/submit/",
        SubmitAssignmentView.as_view(),
        name="submit-assignment",
    ),

    path(
        "<int:assignment_id>/submissions/",
        AssignmentSubmissionsView.as_view(),
        name="assignment-submissions",
    ),

    path(
    "<int:assignment_id>/submissions/<int:submission_id>/",
    SubmissionDetailView.as_view(),
    name="submission-detail",
),
path(
    "<int:assignment_id>/submissions/<int:submission_id>/grade/",
    GradeSubmissionView.as_view(),
    name="grade-submission",
),

]
