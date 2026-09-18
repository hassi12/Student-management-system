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

  return (
    <div>
      <header className="topbar">
        <div>
          <h1>Assignments</h1>
          <p>View and submit your course assignments</p>
        </div>
      </header>

      <div className="panel">
        {message && <p>{message}</p>}

        {assignments.map((assignment) => (
          <div className="assignment" key={assignment.id}>
            <div>
              <strong>{assignment.title}</strong>
              <span>Course ID: {assignment.course}</span>
            </div>

            <div>
              <small>
                Due: {new Date(assignment.due_date).toLocaleString()}
              </small>

              <button
                onClick={() =>
                  navigate(`/assignments/${assignment.id}`)
                }
              >
                Open Assignment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Assignments;