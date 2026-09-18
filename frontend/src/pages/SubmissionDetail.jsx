
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function SubmissionDetail() {
  const { id, submissionId } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);

  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");

  const [message, setMessage] = useState(
    "Loading submission..."
  );

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(
      `http://127.0.0.1:8000/api/assignments/${id}/submissions/${submissionId}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load submission.");
        }

        return response.json();
      })
      .then((data) => {
        setSubmission(data);

        setMarks(
          data.marks !== null &&
          data.marks !== undefined
            ? data.marks
            : ""
        );

        setFeedback(data.feedback || "");

        setMessage("");
      })
      .catch((error) => {
        console.error(error);
        setMessage("Could not load submission.");
      });
  }, [id, submissionId]);

  const formatDate = (date) => {
    if (!date) {
      return "Not submitted";
    }

    return new Date(date).toLocaleString();
  };

  const saveGrade = async () => {
    const token = localStorage.getItem("token");

    if (marks === "") {
      setMessage("Please enter marks.");
      return;
    }

    setSaving(true);
    setMessage("Saving grade...");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/assignments/${id}/submissions/${submissionId}/grade/`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },

          body: JSON.stringify({
            marks: Number(marks),
            feedback: feedback,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.marks?.[0] ||
          data.detail ||
          "Could not save grade."
        );
      }

      setSubmission(data);

      setMarks(data.marks);
      setFeedback(data.feedback || "");

      setMessage("Grade saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!submission) {
    return (
      <div className="submission-detail-page">
        <div className="submission-detail-loading">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="submission-detail-page">

      <button
        className="submission-detail-back"
        onClick={() =>
          navigate(`/assignments/${id}/submissions`)
        }
      >
        ← Back to Submissions
      </button>

      <div className="submission-detail-header">

        <div>

          <div className="submission-detail-label">
            STUDENT SUBMISSION
          </div>

          <h1>{submission.student_name}</h1>

          <p>
            Roll Number:{" "}
            <strong>
              {submission.student_roll_number}
            </strong>
          </p>

        </div>

        <span
          className={
            submission.status === "graded"
              ? "review-status graded"
              : "review-status submitted"
          }
        >
          {submission.status}
        </span>

      </div>

      <div className="submission-detail-meta">

        <div>
          <span>Assignment</span>

          <strong>
            Assignment #{submission.assignment}
          </strong>
        </div>

        <div>
          <span>Submitted At</span>

          <strong>
            {formatDate(submission.submitted_at)}
          </strong>
        </div>

        <div>
          <span>Current Marks</span>

          <strong>
            {submission.marks !== null &&
            submission.marks !== undefined
              ? submission.marks
              : "Not graded"}
          </strong>
        </div>

      </div>

      <div className="submission-answer-card">

        <div className="submission-card-heading">

          <div className="submission-heading-number">
            01
          </div>

          <div>
            <h2>Student Answer</h2>

            <p>
              Review the answer before assigning marks.
            </p>
          </div>

        </div>

        <div className="student-answer">

          {submission.answer ? (
            submission.answer
          ) : (
            <span className="empty-answer">
              No written answer was provided.
            </span>
          )}

        </div>

      </div>

      <div className="grading-card">

        <div className="submission-card-heading">

          <div className="submission-heading-number">
            02
          </div>

          <div>
            <h2>Grade Submission</h2>

            <p>
              Enter marks and provide feedback to the student.
            </p>
          </div>

        </div>

        <div className="grading-form">

          <div className="marks-field">

            <label>
              Marks
            </label>

            <input
              type="number"
              min="0"
              value={marks}
              onChange={(e) =>
                setMarks(e.target.value)
              }
              placeholder="Enter marks"
            />

          </div>

          <div className="marks-limit">
            Maximum marks are determined by the assignment.
          </div>

          <div className="feedback-field">

            <label>
              Feedback
            </label>

            <textarea
              value={feedback}
              onChange={(e) =>
                setFeedback(e.target.value)
              }
              placeholder="Write feedback for the student..."
            />

          </div>

          <div className="grading-actions">

            <button
              className="save-grade-button"
              onClick={saveGrade}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Grade"}
            </button>

          </div>

        </div>

      </div>

      {message &&
        message !== "Loading submission..." && (
          <div className="submission-action-message">
            {message}
          </div>
        )}

    </div>
  );
}

export default SubmissionDetail;
