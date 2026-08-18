from django.db import models


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class Batch(models.Model):
    name = models.CharField(max_length=50)
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField()

    def __str__(self):
        return self.name


class Semester(models.Model):
    number = models.PositiveIntegerField(unique=True)
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name