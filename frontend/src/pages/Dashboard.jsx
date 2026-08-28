function Dashboard() {
  return (
    <div className="dashboard">

      {/* PAGE TITLE */}
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Here's what's happening with your studies.</p>
        </div>
      </div>


      {/* STATISTICS */}
      <section className="dashboard-stats">

        <DashboardCard
          title="My Courses"
          value="5"
          subtitle="Active courses"
        />

        <DashboardCard
          title="Pending Assignments"
          value="3"
          subtitle="Need your attention"
        />

        <DashboardCard
          title="Attendance"
          value="87%"
          subtitle="Overall attendance"
        />

        <DashboardCard
          title="Unread Messages"
          value="4"
          subtitle="New messages"
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


          <Course
            name="Programming Fundamentals"
            code="CS-101"
          />

          <Course
            name="Introduction to Computing"
            code="CS-102"
          />

          <Course
            name="Database Systems"
            code="CS-201"
          />

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