from math import radians, sin, cos, sqrt, atan2

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import AttendanceSession, AttendanceRecord
from accounts.models import StudentProfile
from courses.models import CourseOffering


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


# ---------------------------------------------------
# STUDENT: MARK GPS ATTENDANCE
# ---------------------------------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_attendance(request):

    # Only students can mark their own attendance
    if request.user.role != "student":
        return Response(
            {"error": "Only students can mark attendance."},
            status=403
        )

    # Get student profile
    try:
        student = StudentProfile.objects.get(
            user=request.user
        )
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

    # Calculate distance from classroom
    distance = calculate_distance(
        latitude,
        longitude,
        session.latitude,
        session.longitude
    )

    # Check classroom radius
    if distance > session.allowed_radius:
        return Response(
            {
                "success": False,
                "message": "You are outside the allowed classroom area.",
                "distance": round(distance, 2),
                "allowed_radius": session.allowed_radius,
            },
            status=403
        )

    # Check student belongs to the same class section
    if student.class_section != session.course_offering.class_section:
        return Response(
            {
                "error": "You are not enrolled in this class section."
            },
            status=403
        )

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
        return Response(
            {
                "success": False,
                "message": "Attendance already marked."
            },
            status=400
        )

    return Response(
        {
            "success": True,
            "message": "Attendance marked successfully.",
            "student": student.roll_number,
            "course": session.course_offering.course.code,
            "distance": round(distance, 2),
        }
    )


# ---------------------------------------------------
# FACE ATTENDANCE
# ---------------------------------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def face_mark_attendance(request):

    # Face attendance should not be available to students
    if request.user.role not in ["teacher", "admin"]:
        return Response(
            {"error": "You are not allowed to use face attendance."},
            status=403
        )

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

    # Make sure student belongs to this class section
    if student.class_section != session.course_offering.class_section:
        return Response(
            {
                "error": "Student does not belong to this class section."
            },
            status=403
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
        return Response(
            {
                "success": False,
                "message": "Attendance already marked.",
                "student": roll_number,
            },
            status=400
        )

    return Response(
        {
            "success": True,
            "message": "Face attendance marked successfully.",
            "student": roll_number,
            "course": session.course_offering.course.code,
        }
    )


# ---------------------------------------------------
# TEACHER: START ATTENDANCE
# ---------------------------------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_attendance(request):

    # Only teachers can start attendance
    if request.user.role != "teacher":
        return Response(
            {"error": "Only teachers can start attendance."},
            status=403
        )

    teacher = request.user

    course_offering_id = request.data.get("course_offering_id")
    latitude = request.data.get("latitude")
    longitude = request.data.get("longitude")
    allowed_radius = request.data.get("allowed_radius", 20)

    if not course_offering_id:
        return Response(
            {"error": "Course offering ID is required."},
            status=400
        )

    if latitude is None or longitude is None:
        return Response(
            {"error": "Latitude and longitude are required."},
            status=400
        )

    # Find course offering
    try:
        course_offering = CourseOffering.objects.get(
            id=course_offering_id
        )
    except CourseOffering.DoesNotExist:
        return Response(
            {"error": "Course offering not found."},
            status=404
        )

    # Make sure this teacher teaches this course
    if course_offering.teacher != teacher:
        return Response(
            {
                "error": "You are not assigned to this course."
            },
            status=403
        )

    # Close any previous active session
    AttendanceSession.objects.filter(
        is_active=True
    ).update(is_active=False)

    # Create new session
    session = AttendanceSession.objects.create(
        course_offering=course_offering,
        teacher=teacher,
        latitude=latitude,
        longitude=longitude,
        allowed_radius=allowed_radius,
        is_active=True
    )

    return Response(
        {
            "success": True,
            "message": "Attendance session started.",
            "session_id": session.id,
            "course": course_offering.course.code,
            "course_name": course_offering.course.name,
            "teacher": teacher.username,
            "class_section": course_offering.class_section.name,
            "latitude": session.latitude,
            "longitude": session.longitude,
            "allowed_radius": session.allowed_radius,
        }
    )