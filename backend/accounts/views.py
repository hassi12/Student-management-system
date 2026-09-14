from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response


User = get_user_model()


@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {"error": "Invalid username or password"},
            status=401
        )

    token, created = Token.objects.get_or_create(user=user)

    return Response({
        "message": "Login successful",
        "token": token.key,
        "user_id": user.id,
        "username": user.username,
        "role": user.role,
    })


@api_view(["POST"])
def forgot_password(request):
    username = request.data.get("username")

    if not username:
        return Response(
            {"error": "Username is required."},
            status=400
        )

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({
            "message": "If the account exists, a password reset link has been generated."
        })

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    reset_link = (
        f"http://localhost:5173/reset-password/{uid}/{token}/"
    )

    print("\nPASSWORD RESET LINK:")
    print(reset_link)
    print()

    return Response({
        "message": "If the account exists, a password reset link has been generated."
    })


    from django.utils.http import urlsafe_base64_decode


@api_view(["POST"])
def reset_password(request):
    uid = request.data.get("uid")
    token = request.data.get("token")
    new_password = request.data.get("new_password")

    if not uid or not token or not new_password:
        return Response(
            {"error": "UID, token and new password are required."},
            status=400
        )

    try:
        user_id = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=user_id)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response(
            {"error": "Invalid password reset link."},
            status=400
        )

    if not default_token_generator.check_token(user, token):
        return Response(
            {"error": "Invalid or expired password reset link."},
            status=400
        )

    user.set_password(new_password)
    user.save()

    return Response({
        "message": "Password has been reset successfully."
    })