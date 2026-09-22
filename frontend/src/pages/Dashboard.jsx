
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

  if (loading) {
    return (
      <div className="dashboard">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* =========================
          WELCOME HEADER
      ========================= */}

      <div className="dashboard-heading">

        <div>
          <h1>
            Welcome back,{" "}
            {student?.first_name || student?.username}
          </h1>

          <p>
            Here's an overview of your academic activities.
          </p>
        </div>

        <div className="student-badge">
          <strong>{student?.roll_number}</strong>
          <span>Student</span>
        </div>

      </div>


      {/* =========================
          STAT CARDS
      ========================= */}

      <section className="dashboard-stats">

        <DashboardCard
          title="My Courses"
          value={courses.length}
          subtitle="Enrolled courses"
        />

        <DashboardCard
          title="Batch"
          value={student?.batch_name || "-"}
          subtitle="Current batch"
        />

        <DashboardCard
          title="Semester"
          value={student?.semester_name || "-"}
          subtitle="Current semester"
        />

        <DashboardCard
          title="Section"
          value={student?.class_section_name || "-"}
          subtitle="Class section"
        />

      </section>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <section className="dashboard-grid">

        {/* =========================
            COURSES
        ========================= */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>My Courses</h2>

              <p>
                Your current enrolled courses
              </p>
            </div>

            <button
              className="view-all"
              onClick={() => {
                window.location.href = "/courses";
              }}
            >
              View All
            </button>

          </div>


          {courses.length > 0 ? (

            courses.map((course) => (

              <Course
                key={course.id}
                name={course.course_name}
                code={course.course_code}
              />

            ))

          ) : (

            <div className="empty-dashboard">
              No courses found.
            </div>

          )}

        </div>


        {/* =========================
            QUICK ACCESS
        ========================= */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>Quick Access</h2>

              <p>
                Frequently used sections
              </p>
            </div>

          </div>


          <QuickLink
            title="Assignments"
            description="View and submit assignments"
            path="/assignments"
          />

          <QuickLink
            title="Quizzes"
            description="Take your available quizzes"
            path="/quizzes"
          />

          <QuickLink
            title="Attendance"
            description="Check your attendance"
            path="/attendance"
          />

          <QuickLink
            title="Books"
            description="Access course books"
            path="/books"
          />

        </div>

      </section>


      {/* =========================
          ACADEMIC INFORMATION
      ========================= */}

      <section className="dashboard-panel dashboard-information">

        <div className="panel-header">

          <div>
            <h2>Student Information</h2>

            <p>
              Your current academic information
            </p>
          </div>

        </div>


        <div className="student-information-grid">

          <InfoItem
            label="Name"
            value={
              student?.first_name ||
              student?.username ||
              "-"
            }
          />

          <InfoItem
            label="Roll Number"
            value={student?.roll_number || "-"}
          />

          <InfoItem
            label="Batch"
            value={student?.batch_name || "-"}
          />

          <InfoItem
            label="Semester"
            value={student?.semester_name || "-"}
          />

          <InfoItem
            label="Section"
            value={student?.class_section_name || "-"}
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

        <strong>{name || "Course"}</strong>

        <span>{code || "No course code"}</span>

      </div>

      <button
        className="course-button"
        onClick={() => {
          window.location.href = "/courses";
        }}
      >
        Open
      </button>

    </div>
  );
}


/* =========================
   QUICK LINK
========================= */

function QuickLink({ title, description, path }) {

  return (
    <div
      className="dashboard-quick-link"
      onClick={() => {
        window.location.href = path;
      }}
    >

      <div>

        <strong>{title}</strong>

        <span>{description}</span>

      </div>

      <span className="quick-arrow">
        →
      </span>

    </div>
  );
}


/* =========================
   INFORMATION ITEM
========================= */

function InfoItem({ label, value }) {

  return (
    <div className="student-info-item">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}


export default Dashboard;
