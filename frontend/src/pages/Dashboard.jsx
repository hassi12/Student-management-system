function Dashboard() {
  return (
    <>
      <header className="topbar">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Ahmed Khan</p>
        </div>

        <div className="student">
          <div className="avatar">AK</div>
          <div>
            <strong>Ahmed Khan</strong>
            <small>BSCS-26-001</small>
          </div>
        </div>
      </header>

      <section className="cards">
        <DashboardCard title="My Courses" value="5" />
        <DashboardCard title="Pending Assignments" value="3" />
        <DashboardCard title="Attendance" value="87%" />
        <DashboardCard title="Unread Messages" value="4" />
      </section>

      <section className="content-grid">
        <div className="panel">
          <h2>My Courses</h2>

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

        <div className="panel">
          <h2>Upcoming Assignments</h2>

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
    </>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="dashboard-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function Course({ name, code }) {
  return (
    <div className="course">
      <div>
        <strong>{name}</strong>
        <span>{code}</span>
      </div>

      <button>Open</button>
    </div>
  );
}

function Assignment({ title, course, due }) {
  return (
    <div className="assignment">
      <div>
        <strong>{title}</strong>
        <span>{course}</span>
      </div>

      <small>{due}</small>
    </div>
  );
}

export default Dashboard;