import requests
import cv2
import os
import numpy as np
import threading
import time
from insightface.app import FaceAnalysis


# =========================
# SETTINGS
# =========================

DJANGO_URL = "http://127.0.0.1:8000/api/attendance/face-mark/"

RTSP_URL = (
    "rtsp://admin:partum123@10.17.65.199:554/"
    "cam/realmonitor?channel=1&subtype=1"
)

FACE_DIR = os.path.join(
    "attendance",
    "face_data"
)

SIMILARITY_THRESHOLD = 0.45

# Process face recognition 5 times per second
RECOGNITION_INTERVAL = 0.20


# =========================
# LOAD MODEL
# =========================

print("Loading face recognition model...")

app = FaceAnalysis(
    name="buffalo_s",
    providers=["CPUExecutionProvider"]
)

app.prepare(
    ctx_id=0,
    det_size=(320, 320)
)

print("Face model loaded.")


# =========================
# LOAD REGISTERED FACES
# =========================

known_faces = {}

for filename in os.listdir(FACE_DIR):

    if not filename.endswith(".npy"):
        continue

    student_id = filename.replace(".npy", "")

    embeddings = np.load(
        os.path.join(FACE_DIR, filename)
    )

    if embeddings.ndim == 1:
        embeddings = embeddings.reshape(1, -1)

    embeddings = embeddings / np.linalg.norm(
        embeddings,
        axis=1,
        keepdims=True
    )

    known_faces[student_id] = embeddings

    print(
        f"Loaded {student_id}: "
        f"{len(embeddings)} samples"
    )


if not known_faces:

    print("No registered faces found.")
    exit()


# =========================
# CAMERA
# =========================

cap = cv2.VideoCapture(
    RTSP_URL,
    cv2.CAP_FFMPEG
)

cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

if not cap.isOpened():

    print("Camera connection failed.")
    exit()

print("Camera connected.")
print("Looking for registered students...")
print("Press Q to quit.")


# =========================
# ATTENDANCE STATUS
# =========================

marked_students = set()

last_recognition_time = 0

display_text = "Looking for faces..."
display_color = (255, 255, 255)


# =========================
# DJANGO ATTENDANCE
# =========================

def mark_attendance(student_id):

    global display_text
    global display_color

    try:

        response = requests.post(
            DJANGO_URL,
            json={
                "roll_number": student_id
            },
            timeout=3
        )

        data = response.json()

        print(
            f"Django: {data}"
        )

        if data.get("success"):

            marked_students.add(student_id)

            display_text = (
                f"ATTENDANCE MARKED: {student_id}"
            )

            display_color = (
                0,
                255,
                0
            )

        elif data.get("message") == "Attendance already marked.":

            marked_students.add(student_id)

            display_text = (
                f"ALREADY MARKED: {student_id}"
            )

            display_color = (
                0,
                255,
                255
            )

        else:

            display_text = (
                f"Django: {data.get('message')}"
            )

            display_color = (
                0,
                0,
                255
            )

    except requests.RequestException as e:

        print(
            "Django connection error:",
            e
        )

        display_text = "Django connection error"

        display_color = (
            0,
            0,
            255
        )


# =========================
# MAIN LOOP
# =========================

while True:

    ret, frame = cap.read()

    if not ret:

        print("Camera frame lost.")
        continue

    # Smaller frame = faster processing
    frame = cv2.resize(
        frame,
        (640, 360)
    )

    current_time = time.time()

    # =========================
    # FACE RECOGNITION
    # =========================

    if (
        current_time - last_recognition_time
        >= RECOGNITION_INTERVAL
    ):

        last_recognition_time = current_time

        faces = app.get(frame)

        if len(faces) == 0:

            display_text = "No face detected"

            display_color = (
                255,
                255,
                255
            )

        else:

            for face in faces:

                embedding = face.embedding

                embedding = (
                    embedding
                    / np.linalg.norm(embedding)
                )

                best_student = None
                best_similarity = -1

                # =========================
                # COMPARE FACES
                # =========================

                for student_id, embeddings in known_faces.items():

                    similarities = np.dot(
                        embeddings,
                        embedding
                    )

                    similarity = np.max(
                        similarities
                    )

                    if similarity > best_similarity:

                        best_similarity = similarity
                        best_student = student_id

                # =========================
                # RECOGNIZED
                # =========================

                if (
                    best_similarity
                    >= SIMILARITY_THRESHOLD
                ):

                    display_text = (
                        f"Recognized: "
                        f"{best_student} "
                        f"({best_similarity:.3f})"
                    )

                    display_color = (
                        0,
                        255,
                        0
                    )

                    print(
                        f"Recognized: "
                        f"{best_student} "
                        f"(similarity "
                        f"{best_similarity:.3f})"
                    )

                    # =========================
                    # MARK ATTENDANCE
                    # =========================

                    if best_student not in marked_students:

                        # Run Django request separately
                        # so video does not freeze
                        threading.Thread(
                            target=mark_attendance,
                            args=(best_student,),
                            daemon=True
                        ).start()

                else:

                    display_text = (
                        f"Unknown "
                        f"({best_similarity:.3f})"
                    )

                    display_color = (
                        0,
                        0,
                        255
                    )


    # =========================
    # DISPLAY
    # =========================

    cv2.putText(
        frame,
        display_text,
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        display_color,
        2
    )

    cv2.putText(
        frame,
        "Press Q to quit",
        (10, 60),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (255, 255, 255),
        2
    )

    cv2.imshow(
        "Face Attendance",
        frame
    )

    key = cv2.waitKey(1) & 0xFF

    if key == ord("q"):

        break


# =========================
# CLEANUP
# =========================

cap.release()

cv2.destroyAllWindows()

print("Attendance system stopped.")