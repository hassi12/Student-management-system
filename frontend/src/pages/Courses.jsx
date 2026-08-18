function Courses() {
  const courses = [
    {
      code: "CS-101",
      name: "Programming Fundamentals",
      teacher: "Muhammad Ali",
      progress: "65%",
    },
    {
      code: "CS-102",
      name: "Introduction to Computing",
      teacher: "Dr. Ahmed",
      progress: "45%",
    },
    {
      code: "CS-201",
      name: "Database Systems",
      teacher: "Muhammad Ali",
      progress: "30%",
    },
  ];

  return (
    <div>
      <header className="topbar">
        <div>
          <h1>My Courses</h1>
          <p>Courses you are currently enrolled in</p>
        </div>
      </header>

      <div className="course-grid">
        {courses.map((course) => (
          <div className="course-card" key={course.code}>
            <span className="course-code">{course.code}</span>

            <h2>{course.name}</h2>

            <p>Teacher: {course.teacher}</p>

            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: course.progress }}
              ></div>
            </div>

            <small>{course.progress} completed</small>

            <button>Open Course</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;