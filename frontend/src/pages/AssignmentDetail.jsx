
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("Loading assignment...");
  const [saving, setSaving] = useState(false);

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

    // Load student's saved draft
    fetch(
      `http://127.0.0.1:8000/api/assignments/${id}/my-submission/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
      .then((response) => {
        // No submission yet
        if (response.status === 404) {
          return null;
        }

        if (!response.ok) {
          throw new Error("Could not load saved draft.");
        }

        return response.json();
      })
      .then((data) => {
        if (data) {
          setAnswer(data.answer || "");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

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
      console.log("SAVE RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
  JSON.stringify(data)
);
      }

      setMessage("Draft saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (message === "Loading assignment...") {
    return <p>{message}</p>;
  }

  if (!assignment) {
    return <p>{message}</p>;
  }

  return (
    <div>
      <button onClick={() => navigate("/assignments")}>
        ← Back to Assignments
      </button>

      <h1>{assignment.title}</h1>

      <p>
        <strong>Due:</strong>{" "}
        {new Date(assignment.due_date).toLocaleString()}
      </p>

      <p>
        <strong>Maximum Marks:</strong> {assignment.max_marks}
      </p>

      <hr />

      <h2>Assignment Question</h2>

      <p>{assignment.description}</p>

      <h2>Write Your Answer</h2>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write your answer here..."
        rows="15"
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "16px",
          boxSizing: "border-box",
        }}
      />

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={saveDraft}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Draft"}
        </button>

        <button
          style={{ marginLeft: "10px" }}
          disabled
        >
          Submit Assignment
        </button>
      </div>

      {message && message !== "Loading assignment..." && (
        <p style={{ marginTop: "15px" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AssignmentDetail;