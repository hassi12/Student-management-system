import cv2

RTSP_URL = "rtsp://admin:partum123@10.17.65.199:554/cam/realmonitor?channel=2&subtype=0"

cap = cv2.VideoCapture(RTSP_URL)

if not cap.isOpened():
    print("❌ Could not connect to camera")
    exit()

print("✅ Camera 2 connected!")

while True:
    ret, frame = cap.read()

    if not ret:
        print("❌ Could not read frame")
        break

    cv2.imshow("Attendance Camera 2", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()