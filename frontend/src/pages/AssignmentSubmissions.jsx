
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AssignmentSubmissions() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [message, setMessage] = useState("Loading submissions...");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Token ${token}`,
    };

    // Load assignment details
    fetch(`http://127.0.0.1:8000/api/assignments/${id}/`, {
      headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load assignment.");
        }

        return response.json();
      })
      .then((data) => {
        setAssignment(data);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Could not load assignment.");
      });

    // Load submissions
    fetch(
      `http://127.0.0.1:8000/api/assignments/${id}/submissions/`,
      {
        headers,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load submissions.");
        }

        return response.json();
      })
      .then((data) => {
        setSubmissions(data);
        setMessage("");
      })
      .catch((error) => {
        console.error(error);
        setMessage("Could not load submissions.");
      });
  }, [id]);

  const formatDate = (date) => {
    if (!date) {
      return "Not submitted";
    }

    return new Date(date).toLocaleString();
  };

  if (message === "Loading submissions...") {
    return (
      <div className="teacher-submissions-page">
        <div className="teacher-submissions-loading">
          Loading submissions...
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-submissions-page">

      <button
        className="teacher-submissions-back"
        onClick={() => navigate("/assignments")}
      >
        ← Back to Assignments
      </button>

      {assignment && (
        <div className="teacher-submissions-header">
          <div>
            <div className="teacher-submissions-label">
              ASSIGNMENT SUBMISSIONS
            </div>

            <h1>{assignment.title}</h1>

            <p>
              Review student submissions for this assignment.
            </p>
          </div>

          <div className="teacher-submission-count">
            {submissions.length}{" "}
            {submissions.length === 1
              ? "Submission"
              : "Submissions"}
          </div>
        </div>
      )}

      {message && message !== "Loading submissions..." && (
        <div className="teacher-submissions-message">
          {message}
        </div>
      )}

      {!message && submissions.length === 0 && (
        <div className="teacher-submissions-empty">
          <h3>No Submissions Yet</h3>

          <p>
            Students have not submitted this assignment yet.
          </p>
        </div>
      )}

      {submissions.length > 0 && (
        <div className="teacher-submissions-card">

          <div className="teacher-submissions-table-wrapper">

            <table className="teacher-submissions-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll Number</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                  <th>Marks</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>

                    <td>
                      <div className="teacher-student-name">
                        <div className="teacher-student-avatar">
                          {submission.student_name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {submission.student_name || "Unknown"}
                        </strong>
                      </div>
                    </td>

                    <td>
                      {submission.student_roll_number || "-"}
                    </td>

                    <td>
                      <span
                        className={
                          submission.status === "graded"
                            ? "submission-status graded"
                            : "submission-status submitted"
                        }
                      >
                        {submission.status}
                      </span>
                    </td>

                    <td>
                      {formatDate(submission.submitted_at)}
                    </td>

                    <td>
                      {submission.marks !== null &&
                      submission.marks !== undefined
                        ? `${submission.marks} / ${assignment?.max_marks}`
                        : "Not graded"}
                    </td>

                    <td>
                      <button
                        className="view-submission-button"
                        onClick={() =>
                          navigate(
                            `/assignments/${id}/submissions/${submission.id}`
                          )
                        }
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}

export default AssignmentSubmissions;