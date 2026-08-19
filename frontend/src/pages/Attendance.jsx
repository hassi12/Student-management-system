import { useState } from "react";

function Attendance() {
  const [status, setStatus] = useState("Not Marked");
  const [location, setLocation] = useState(null);

  const getMyLocation = () => {
    setStatus("Getting your location...");

    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const studentLat = position.coords.latitude;
        const studentLng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setLocation({
          latitude: studentLat,
          longitude: studentLng,
          accuracy: accuracy,
        });

        console.log("Latitude:", studentLat);
        console.log("Longitude:", studentLng);
        console.log("GPS Accuracy:", accuracy);

        setStatus("Location detected");
      },
      (error) => {
        console.log("Location Error:", error.message);
        setStatus("Unable to get your location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const markAttendance = () => {
    setStatus("Checking your location...");

    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setLocation({
          latitude: latitude,
          longitude: longitude,
          accuracy: accuracy,
        });

        try {
          const token = localStorage.getItem("token");

          if (!token) {
            setStatus("Please login first.");
            return;
          }

          const response = await fetch(
            "http://127.0.0.1:8000/api/attendance/mark/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
              body: JSON.stringify({
                latitude: latitude,
                longitude: longitude,
              }),
            }
          );

          const data = await response.json();

          console.log("Attendance API:", data);

          if (response.ok) {
            setStatus("Attendance Marked ✅");
          } else {
            setStatus(
              data.message ||
                data.error ||
                "Attendance failed."
            );
          }
        } catch (error) {
          console.error("API Error:", error);
          setStatus("Could not connect to Django server.");
        }
      },
      (error) => {
        console.log("Location Error:", error.message);
        setStatus("Unable to get your location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div>
      <header className="topbar">
        <div>
          <h1>Attendance</h1>
          <p>
            Mark your attendance using your current location
          </p>
        </div>
      </header>

      <div className="content-grid">
        <div className="panel">
          <h2>Today's Attendance</h2>

          <p>
            Course: CS-101 - Programming Fundamentals
          </p>

          <p>
            <strong>Status:</strong> {status}
          </p>

          <button
            className="primary-button"
            onClick={getMyLocation}
          >
            📍 Show My Location
          </button>

          <button
            className="primary-button"
            onClick={markAttendance}
            style={{ marginLeft: "10px" }}
          >
            Mark Attendance
          </button>

          {location && (
            <div style={{ marginTop: "20px" }}>
              <p>
                <strong>Your Latitude:</strong>{" "}
                {location.latitude}
              </p>

              <p>
                <strong>Your Longitude:</strong>{" "}
                {location.longitude}
              </p>

              <p>
                <strong>GPS Accuracy:</strong>{" "}
                {Math.round(location.accuracy)} meters
              </p>
            </div>
          )}
        </div>

        <div className="panel">
          <h2>Attendance Summary</h2>

          <p>
            Programming Fundamentals: 87%
          </p>

          <p>
            Introduction to Computing: 92%
          </p>

          <p>
            Database Systems: 81%
          </p>
        </div>
      </div>
    </div>
  );
}

export default Attendance;