function Assignments() {
  const assignments = [
    {
      title: "Python Functions",
      course: "CS-101 - Programming Fundamentals",
      due: "Tomorrow",
      status: "Pending",
    },
    {
      title: "Database ER Diagram",
      course: "CS-201 - Database Systems",
      due: "Friday",
      status: "Pending",
    },
    {
      title: "Computer Basics",
      course: "CS-102 - Introduction to Computing",
      due: "Completed",
      status: "Submitted",
    },
  ];

  return (
    <div>
      <header className="topbar">
        <div>
          <h1>Assignments</h1>
          <p>View and submit your course assignments</p>
        </div>
      </header>

      <div className="panel">
        {assignments.map((assignment, index) => (
          <div className="assignment" key={index}>
            <div>
              <strong>{assignment.title}</strong>
              <span>{assignment.course}</span>
            </div>

            <div>
              <small>{assignment.due}</small>
              <button>
                {assignment.status === "Submitted"
                  ? "View Submission"
                  : "Open Assignment"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Assignments;