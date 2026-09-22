
import { useEffect, useState } from "react";

function Quizzes() {

  const [quizzes, setQuizzes] = useState([]);
  const [message, setMessage] = useState("Loading quizzes...");

  useEffect(() => {

    const fetchQuizzes = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://127.0.0.1:8000/api/quizzes/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {

          setQuizzes(data);
          setMessage("");

        } else {

          setMessage(
            data.detail || "Could not load quizzes."
          );
        }

      } catch (error) {

        console.error(error);

        setMessage(
          "Could not connect to Django server."
        );
      }
    };

    fetchQuizzes();

  }, []);

  return (
    <div>

      <header className="topbar">

        <div>
          <h1>Quizzes</h1>

          <p>
            Take your available course quizzes
          </p>
        </div>

      </header>

      {message && (
        <p style={{ padding: "20px" }}>
          {message}
        </p>
      )}

      <div className="content-grid">

        {quizzes.map((quiz) => (

          <div
            className="panel"
            key={quiz.id}
          >

            <h2>{quiz.title}</h2>

            <p>
  Course Offering: {quiz.course_offering}
</p>

            <br />

            <p>
              Questions: {quiz.number_of_questions}
            </p>

            <p>
              Time limit: {quiz.time_limit} minutes
            </p>

            <br />

           <button
  className="primary-button"
  onClick={() => {
    window.location.href = `/quizzes/${quiz.id}`;
  }}
>
  Start Quiz
</button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Quizzes;
