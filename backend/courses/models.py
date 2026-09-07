from django.db import models


class Course(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=150)

    department = models.ForeignKey(
        "students.Department",
        on_delete=models.PROTECT
    )

    semester = models.ForeignKey(
        "students.Semester",
        on_delete=models.PROTECT
    )

    credit_hours = models.PositiveIntegerField(default=3)

    def __str__(self):
        return f"{self.code} - {self.name}"


class CourseOffering(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE
    )

    class_section = models.ForeignKey(
        "students.ClassSection",
        on_delete=models.CASCADE
    )

    teacher = models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        limit_choices_to={"role": "teacher"}
    )

    class Meta:
        unique_together = ("course", "class_section")

    def __str__(self):
        return (
            f"{self.course.code} - "
            f"{self.class_section.name} - "
            f"{self.teacher.get_full_name() or self.teacher.username}"
        )


class Enrollment(models.Model):
    student = models.ForeignKey(
        "accounts.StudentProfile",
        on_delete=models.CASCADE
    )

    course_offering = models.ForeignKey(
    CourseOffering,
    on_delete=models.CASCADE,
    null=True,
    blank=True
)

    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "course_offering")

def __str__(self):
    if self.course_offering:
        return (
            f"{self.student.roll_number} - "
            f"{self.course_offering.course.code}"
        )

    return f"{self.student.roll_number} - No Course Offering"