import { useEffect, useState } from "react";

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    Promise.all([
      fetch("http://127.0.0.1:8000/api/students/me/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      }).then((response) => response.json()),

      fetch("http://127.0.0.1:8000/api/enrollments/my/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      }).then((response) => response.json()),
    ])
      .then(([studentData, courseData]) => {
        setStudent(studentData);
        setCourses(courseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading dashboard:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/students/me/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setStudent(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading student profile:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="dashboard">

      {/* PAGE TITLE */}
      <div className="dashboard-heading">
        <div>
          <h1>
            Welcome, {student?.first_name || student?.username}
          </h1>

          <p>
            Roll No: {student?.roll_number}
          </p>
        </div>
      </div>


      {/* STUDENT INFORMATION */}
      <section className="dashboard-stats">

        <DashboardCard
  title="My Courses"
  value={courses.length}
  subtitle="Enrolled courses"
/>

        <DashboardCard
          title="Batch"
          value={student?.batch_name}
          subtitle="Current batch"
        />

        <DashboardCard
          title="Semester"
          value={student?.semester_name}
          subtitle="Current semester"
        />

        <DashboardCard
          title="Section"
          value={student?.class_section_name}
          subtitle="Class section"
        />

      </section>


      {/* MAIN DASHBOARD CONTENT */}
      <section className="dashboard-grid">

        {/* COURSES */}
        <div className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h2>My Courses</h2>
              <p>Your current courses</p>
            </div>

            <button className="view-all">
              View All
            </button>
          </div>

          {courses.map((course) => (
  <Course
    key={course.id}
    name={course.course_name}
    code={course.course_code}
  />
))}

          {courses.map((course) => (
  <Course
    key={course.id}
    name={course.course_name}
    code={course.course_code}
  />
))}

          {courses.map((course) => (
  <Course
    key={course.id}
    name={course.course_name}
    code={course.course_code}
  />
))}

        </div>


        {/* ASSIGNMENTS */}
        <div className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h2>Upcoming Assignments</h2>
              <p>Assignments that need attention</p>
            </div>

            <button className="view-all">
              View All
            </button>
          </div>

          <Assignment
            title="Python Functions"
            course="Programming Fundamentals"
            due="Tomorrow"
          />

          <Assignment
            title="Database ER Diagram"
            course="Database Systems"
            due="Friday"
          />

        </div>

      </section>

    </div>
  );
}


/* =========================
   DASHBOARD CARD
========================= */

function DashboardCard({ title, value, subtitle }) {
  return (
    <div className="dashboard-stat-card">

      <p>{title}</p>

      <h2>{value}</h2>

      <span>{subtitle}</span>

    </div>
  );
}


/* =========================
   COURSE
========================= */

function Course({ name, code }) {
  return (
    <div className="dashboard-course">

      <div className="course-info">

        <strong>{name}</strong>

        <span>{code}</span>

      </div>

      <button className="course-button">
        Open
      </button>

    </div>
  );
}


/* =========================
   ASSIGNMENT
========================= */

function Assignment({ title, course, due }) {
  return (
    <div className="dashboard-assignment">

      <div className="assignment-info">

        <strong>{title}</strong>

        <span>{course}</span>

      </div>

      <div className="assignment-due">
        {due}
      </div>

    </div>
  );
}


export default Dashboard;