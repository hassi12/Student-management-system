from django.db import models


class Conversation(models.Model):
    student = models.ForeignKey(
        "accounts.StudentProfile",
        on_delete=models.CASCADE,
        related_name="conversations"
    )

    teacher = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="teacher_conversations"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.roll_number} - {self.teacher.get_full_name()}"


class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )

    sender = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE
    )

    message = models.TextField()

    sent_at = models.DateTimeField(auto_now_add=True)

    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.username}: {self.message[:30]}"