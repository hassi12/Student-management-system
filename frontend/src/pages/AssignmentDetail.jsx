
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("Loading assignment...");
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [marks, setMarks] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Load assignment
    fetch(`http://127.0.0.1:8000/api/assignments/${id}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load assignment.");
        }

        return response.json();
      })
      .then((data) => {
        setAssignment(data);
        setMessage("");
      })
      .catch((error) => {
        console.error(error);
        setMessage("Could not load assignment.");
      });

    // Load student's saved submission
    fetch(
      `http://127.0.0.1:8000/api/assignments/${id}/my-submission/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.status === 404) {
          return null;
        }

        if (!response.ok) {
          throw new Error("Could not load saved submission.");
        }

        return response.json();
      })
      .then((data) => {
        if (data) {
          setAnswer(data.answer || "");

          setMarks(
            data.marks !== null && data.marks !== undefined
              ? data.marks
              : null
          );

          setFeedback(data.feedback || "");

          if (
            data.status === "submitted" ||
            data.status === "graded"
          ) {
            setSubmitted(true);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  // Save draft
  const saveDraft = async () => {
    const token = localStorage.getItem("token");

    setSaving(true);
    setMessage("Saving draft...");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/assignments/submit/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            assignment: assignment.id,
            answer: answer,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }

      setMessage("Draft saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Submit assignment
  const submitAssignment = async () => {
    const token = localStorage.getItem("token");

    setSaving(true);
    setMessage("Submitting assignment...");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/assignments/${id}/submit/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }

      setSubmitted(true);
      setMessage("Assignment submitted successfully.");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (message === "Loading assignment...") {
    return (
      <div className="assignment-detail-page">
        <div className="assignment-detail-loading">
          Loading assignment...
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="assignment-detail-page">
        <div className="assignment-detail-error">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-detail-page">

      {/* Back button */}
      <button
        className="assignment-back-button"
        onClick={() => navigate("/assignments")}
      >
        ← Back to Assignments
      </button>

      {/* Assignment header */}
      <div className="assignment-detail-header">

        <div>
          <div className="assignment-detail-label">
            ASSIGNMENT
          </div>

          <h1>{assignment.title}</h1>

          <p>
            Complete the assignment and submit your answer
            before the due date.
          </p>
        </div>

        <div
          className={
            submitted
              ? "detail-status submitted"
              : "detail-status pending"
          }
        >
          {submitted ? "✓ Submitted" : "Pending"}
        </div>

      </div>

      {/* Assignment information */}
      <div className="assignment-meta">

        <div className="assignment-meta-item">
          <span>Due Date</span>

          <strong>
            {new Date(
              assignment.due_date
            ).toLocaleString()}
          </strong>
        </div>

        <div className="assignment-meta-item">
          <span>Maximum Marks</span>

          <strong>
            {assignment.max_marks}
          </strong>
        </div>

        <div className="assignment-meta-item">
          <span>Course</span>

          <strong>
            Course {assignment.course}
          </strong>
        </div>

      </div>

      {/* Question */}
      <div className="assignment-detail-card">

        <div className="detail-card-heading">
          <span className="detail-number">01</span>

          <div>
            <h2>Assignment Question</h2>
            <p>Read the question carefully before answering.</p>
          </div>
        </div>

        <div className="assignment-question">
          {assignment.description}
        </div>

      </div>

      {/* Answer */}
      <div className="assignment-detail-card">

        <div className="detail-card-heading">
          <span className="detail-number">02</span>

          <div>
            <h2>Your Answer</h2>

            <p>
              Write your answer directly in the portal.
            </p>
          </div>
        </div>

        <textarea
          className="assignment-answer-box"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer here..."
          disabled={submitted}
        />

        {!submitted && (
          <div className="answer-footer">

            <span className="answer-hint">
              Your answer will be saved with this assignment.
            </span>

            <span className="character-count">
              {answer.length} characters
            </span>

          </div>
        )}

      </div>

      {/* Teacher Grade & Feedback */}
      {submitted && (
        <div className="assignment-detail-card assignment-grade-card">

          <div className="detail-card-heading">
            <span className="detail-number">03</span>

            <div>
              <h2>Grade & Feedback</h2>

              <p>
                Your teacher's evaluation of this assignment.
              </p>
            </div>
          </div>

          <div className="student-grade-section">

            <div className="student-marks-box">
              <span>Marks Obtained</span>

              <strong>
                {marks !== null
                  ? `${marks} / ${assignment.max_marks}`
                  : "Not graded yet"}
              </strong>
            </div>

            <div className="student-feedback-box">
              <span>Teacher Feedback</span>

              <p>
                {feedback
                  ? feedback
                  : "No feedback has been provided yet."}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Actions */}
      <div className="assignment-actions">

        {!submitted && (
          <>
            <button
              className="save-draft-button"
              onClick={saveDraft}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>

            <button
              className="submit-assignment-button"
              onClick={submitAssignment}
              disabled={saving}
            >
              {saving
                ? "Submitting..."
                : "Submit Assignment"}
            </button>
          </>
        )}

        {submitted && (
          <div className="submission-success">
            <div className="success-icon">✓</div>

            <div>
              <strong>Assignment Submitted</strong>

              <p>
                Your answer has been successfully submitted.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Message */}
      {message &&
        message !== "Loading assignment..." &&
        !submitted && (
          <div className="assignment-action-message">
            {message}
          </div>
        )}

    </div>
  );
}

export default AssignmentDetail;
