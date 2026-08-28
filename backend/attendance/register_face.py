import cv2
import os
import numpy as np
from insightface.app import FaceAnalysis

# =========================
# CAMERA SETTINGS
# =========================

RTSP_URL = "rtsp://admin:partum123@10.17.65.199:554/cam/realmonitor?channel=1&subtype=0"

# Student we are registering
STUDENT_ID = "TEST002"
# Where face embeddings will be stored
SAVE_DIR = "attendance/face_data"
os.makedirs(SAVE_DIR, exist_ok=True)

SAVE_PATH = os.path.join(SAVE_DIR, f"{STUDENT_ID}.npy")


# =========================
# LOAD FACE MODEL
# =========================

print("Loading face recognition model...")

app = FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]
)

app.prepare(
    ctx_id=0,
    det_size=(640, 640)
)

print("Face model loaded.")


# =========================
# CONNECT TO CAMERA
# =========================

cap = cv2.VideoCapture(RTSP_URL)

if not cap.isOpened():
    print("❌ Could not connect to Camera 1")
    exit()

print("✅ Camera connected.")
print("Look at the camera.")
print("Press S to save your face.")
print("Press Q to quit.")


# =========================
# CAMERA LOOP
# =========================

while True:

    ret, frame = cap.read()

    if not ret:
        print("❌ Could not read frame.")
        break

    faces = app.get(frame)

    display_frame = frame.copy()

    for face in faces:

        box = face.bbox.astype(int)

        x1, y1, x2, y2 = box

        cv2.rectangle(
            display_frame,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )

        cv2.putText(
            display_frame,
            "Face detected",
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2
        )

    cv2.imshow("Register Face - TEST001", display_frame)

    key = cv2.waitKey(1) & 0xFF

    # Save face
    if key == ord("s"):

        if len(faces) == 0:
            print("❌ No face detected.")

        elif len(faces) > 1:
            print("❌ More than one face detected.")
            print("Only one person should be in front of the camera.")

        else:
            face = faces[0]

            embedding = face.embedding

            np.save(
                SAVE_PATH,
                embedding
            )

            print()
            print("✅ Face registered successfully!")
            print(f"Student: {STUDENT_ID}")
            print(f"Saved to: {SAVE_PATH}")
            print()

            break

    elif key == ord("q"):
        print("Registration cancelled.")
        break


cap.release()
cv2.destroyAllWindows()