
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState("Loading assignments...");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/assignments/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load assignments.");
        }

        return response.json();
      })
      .then((data) => {
        setAssignments(data);
        setMessage("");
      })
      .catch((error) => {
        console.error(error);
        setMessage("Could not load assignments.");
      });
  }, []);

  const getStatus = (assignment) => {
    const dueDate = new Date(assignment.due_date);
    const now = new Date();

    if (dueDate < now) {
      return "Overdue";
    }

    return "Pending";
  };

  return (
    <div className="assignments-page">

      {/* Header */}
      <header className="topbar">
        <div>
          <h1>Assignments</h1>
          <p>
            View your assignments, submit your answers, and track your work.
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="assignments-container">

        {/* Page heading */}
        <div className="assignments-heading">
          <div>
            <h2>My Assignments</h2>
            <p>
              Complete and submit your assignments before the due date.
            </p>
          </div>

          <div className="assignment-count">
            {assignments.length}{" "}
            {assignments.length === 1 ? "Assignment" : "Assignments"}
          </div>
        </div>

        {/* Loading / error */}
        {message && (
          <div className="assignment-message">
            {message}
          </div>
        )}

        {/* Empty state */}
        {!message && assignments.length === 0 && (
          <div className="assignment-empty">
            <h3>No Assignments Yet</h3>
            <p>
              Your teachers have not posted any assignments yet.
            </p>
          </div>
        )}

        {/* Assignment cards */}
        <div className="assignment-grid">
          {assignments.map((assignment) => {
            const status = getStatus(assignment);

            return (
              <div
                className="assignment-card"
                key={assignment.id}
              >

                {/* Card top */}
                <div className="assignment-card-top">

                  <div className="assignment-icon">
                    📝
                  </div>

                  <span
                    className={
                      status === "Overdue"
                        ? "assignment-status overdue"
                        : "assignment-status pending"
                    }
                  >
                    {status}
                  </span>

                </div>

                {/* Title */}
                <h3>{assignment.title}</h3>

                {/* Course */}
                <p className="assignment-course">
                  Course ID: {assignment.course}
                </p>

                {/* Description */}
                <p className="assignment-description">
                  {assignment.description}
                </p>

                {/* Information */}
                <div className="assignment-info">

                  <div>
                    <span>Due Date</span>
                    <strong>
                      {new Date(
                        assignment.due_date
                      ).toLocaleDateString()}
                    </strong>
                  </div>

                  <div>
                    <span>Maximum Marks</span>
                    <strong>
                      {assignment.max_marks}
                    </strong>
                  </div>

                </div>

                {/* Button */}
                <button
                  className="assignment-open-button"
                  onClick={() =>
                    navigate(
                      `/assignments/${assignment.id}`
                    )
                  }
                >
                  Open Assignment
                  <span>→</span>
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Assignments;
