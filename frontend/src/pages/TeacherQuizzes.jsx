
import { useEffect, useState } from "react";

function TeacherQuizzes() {

  const [quizzes, setQuizzes] = useState([]);
  const [message, setMessage] = useState("Loading quizzes...");


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


  useEffect(() => {

    fetchQuizzes();

  }, []);


  const togglePublish = async (quiz) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://127.0.0.1:8000/api/quizzes/${quiz.id}/`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },

          body: JSON.stringify({
            published: !quiz.published,
          }),
        }
      );


      if (response.ok) {

        fetchQuizzes();

      } else {

        const data = await response.json();

        alert(
          data.detail || "Could not update quiz."
        );

      }

    } catch (error) {

      console.error(error);

      alert(
        "Could not connect to Django server."
      );

    }

  };


  return (

    <div>

      <header className="topbar">

        <div>

          <h1>Manage Quizzes</h1>

          <p>
            Create, publish and manage your quizzes
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

            <h2>
              {quiz.title}
            </h2>


            <p>
              Questions: {quiz.number_of_questions}
            </p>


            <p>
              Time: {quiz.time_limit} minutes
            </p>


            <p
              style={{
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >

              Status:{" "}

              {quiz.published
                ? "Published"
                : "Not Published"}

            </p>


            <button
              className="primary-button"
              onClick={() =>
                togglePublish(quiz)
              }
              style={{
                marginTop: "15px",
              }}
            >

              {quiz.published
                ? "Unpublish"
                : "Publish"}

            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default TeacherQuizzes;
