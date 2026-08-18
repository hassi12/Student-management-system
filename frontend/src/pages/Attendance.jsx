function Attendance() {
  return (
    <div>
      <header className="topbar">
        <div>
          <h1>Attendance</h1>
          <p>Mark your attendance using your current location</p>
        </div>
      </header>

      <div className="content-grid">
        <div className="panel">
          <h2>Today's Attendance</h2>

          <p>Course: CS-101 - Programming Fundamentals</p>
          <p>Status: Not Marked</p>

          <button className="primary-button">
            Mark Attendance
          </button>
        </div>

        <div className="panel">
          <h2>Attendance Summary</h2>

          <p>Programming Fundamentals: 87%</p>
          <p>Introduction to Computing: 92%</p>
          <p>Database Systems: 81%</p>
        </div>
      </div>
    </div>
  );
}

export default Attendance;