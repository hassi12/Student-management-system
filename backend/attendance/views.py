from math import radians, sin, cos, sqrt, atan2

from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import AttendanceSession, AttendanceRecord
from accounts.models import StudentProfile


def calculate_distance(lat1, lon1, lat2, lon2):
    earth_radius = 6371000

    lat1 = radians(float(lat1))
    lon1 = radians(float(lon1))
    lat2 = radians(float(lat2))
    lon2 = radians(float(lon2))

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return earth_radius * c


@api_view(["POST"])
def mark_attendance(request):

    # Get token from Authorization header
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return Response(
            {"error": "Authentication token is required."},
            status=401
        )

    try:
        token_key = auth_header.split(" ")[1]
        token = Token.objects.get(key=token_key)
        user = token.user
    except (IndexError, Token.DoesNotExist):
        return Response(
            {"error": "Invalid authentication token."},
            status=401
        )

    # Get student profile
    try:
        student = StudentProfile.objects.get(user=user)
    except StudentProfile.DoesNotExist:
        return Response(
            {"error": "Student profile not found."},
            status=404
        )

    # Get GPS coordinates
    latitude = request.data.get("latitude")
    longitude = request.data.get("longitude")

    if latitude is None or longitude is None:
        return Response(
            {"error": "Latitude and longitude are required."},
            status=400
        )

    # Find active attendance session
    session = (
        AttendanceSession.objects
        .filter(is_active=True)
        .order_by("-id")
        .first()
    )

    if not session:
        return Response(
            {"error": "No active attendance session."},
            status=404
        )

    # Calculate distance
    distance = calculate_distance(
        latitude,
        longitude,
        session.latitude,
        session.longitude
    )

    # Check classroom radius
    if distance > session.allowed_radius:
        return Response({
            "success": False,
            "message": "You are outside the allowed classroom area.",
            "distance": round(distance, 2),
            "allowed_radius": session.allowed_radius,
        }, status=403)

    # Create attendance record
    record, created = AttendanceRecord.objects.get_or_create(
        session=session,
        student=student,
        defaults={
            "latitude": latitude,
            "longitude": longitude,
            "is_present": True,
        }
    )

    if not created:
        return Response({
            "success": False,
            "message": "Attendance already marked.",
        }, status=400)

    return Response({
        "success": True,
        "message": "Attendance marked successfully.",
        "student": student.roll_number,
        "course": session.course.code,
        "distance": round(distance, 2),
    })
@api_view(["POST"])
def face_mark_attendance(request):

    roll_number = request.data.get("roll_number")

    if not roll_number:
        return Response(
            {"error": "Roll number is required."},
            status=400
        )

    # Find student
    try:
        student = StudentProfile.objects.get(
            roll_number=roll_number
        )
    except StudentProfile.DoesNotExist:
        return Response(
            {"error": "Student not found."},
            status=404
        )

    # Find active attendance session
    session = (
        AttendanceSession.objects
        .filter(is_active=True)
        .order_by("-id")
        .first()
    )

    if not session:
        return Response(
            {"error": "No active attendance session."},
            status=404
        )

    # Mark attendance
    record, created = AttendanceRecord.objects.get_or_create(
        session=session,
        student=student,
        defaults={
            "is_present": True,
        }
    )

    if not created:
        return Response({
            "success": False,
            "message": "Attendance already marked.",
            "student": roll_number,
        }, status=400)

    return Response({
        "success": True,
        "message": "Face attendance marked successfully.",
        "student": roll_number,
        "course": session.course.code,
    })


@api_view(["POST"])
def start_attendance(request):

    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return Response(
            {"error": "Authentication token is required."},
            status=401
        )

    try:
        token_key = auth_header.split(" ")[1]
        token = Token.objects.get(key=token_key)
        teacher = token.user
    except (IndexError, Token.DoesNotExist):
        return Response(
            {"error": "Invalid authentication token."},
            status=401
        )

    if teacher.role != "teacher":
        return Response(
            {"error": "Only teachers can start attendance."},
            status=403
        )

    course_id = request.data.get("course_id")
    latitude = request.data.get("latitude")
    longitude = request.data.get("longitude")
    allowed_radius = request.data.get("allowed_radius", 20)

    if not course_id:
        return Response(
            {"error": "Course ID is required."},
            status=400
        )

    if latitude is None or longitude is None:
        return Response(
            {"error": "Latitude and longitude are required."},
            status=400
        )

    AttendanceSession.objects.filter(
        is_active=True
    ).update(is_active=False)

    session = AttendanceSession.objects.create(
        course_id=course_id,
        teacher=teacher,
        latitude=latitude,
        longitude=longitude,
        allowed_radius=allowed_radius,
        is_active=True
    )

    return Response({
        "success": True,
        "message": "Attendance session started.",
        "session_id": session.id,
        "course": session.course.code,
        "teacher": teacher.username,
        "latitude": session.latitude,
        "longitude": session.longitude,
        "allowed_radius": session.allowed_radius
    })