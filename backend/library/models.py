from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=200)

    author = models.CharField(max_length=150, blank=True)

    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    file = models.FileField(upload_to="books/")

    description = models.TextField(blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Note(models.Model):
    title = models.CharField(max_length=200)

    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE
    )

    file = models.FileField(upload_to="notes/")

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
