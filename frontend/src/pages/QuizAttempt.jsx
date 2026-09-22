
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function QuizAttempt() {

  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [message, setMessage] = useState("Loading questions...");

  useEffect(() => {

    const fetchQuestions = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://127.0.0.1:8000/api/quizzes/${id}/questions/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {

          setQuestions(data);
          setMessage("");

        } else {

          setMessage(
            data.detail || "Could not load questions."
          );
        }

      } catch (error) {

        console.error(error);

        setMessage(
          "Could not connect to Django server."
        );
      }
    };

    fetchQuestions();

  }, [id]);


  /*
    One-minute timer for each question
  */

  useEffect(() => {

    if (questions.length === 0) {
      return;
    }

    if (timeLeft <= 0) {

      goToNextQuestion();

      return;
    }

    const timer = setInterval(() => {

      setTimeLeft((previousTime) => previousTime - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft, questions.length]);


  const goToNextQuestion = () => {

    if (currentQuestion < questions.length - 1) {

      setCurrentQuestion(
        currentQuestion + 1
      );

      setTimeLeft(60);

    } else {

      alert("Quiz completed!");

    }

  };


  const handleAnswerChange = (questionId, answer) => {

    setAnswers({
      ...answers,
      [questionId]: answer,
    });

  };


  if (questions.length === 0) {

    return (
      <div>

        <header className="topbar">

          <div>

            <h1>Quiz</h1>

            <p>{message}</p>

          </div>

        </header>

      </div>
    );

  }


  const question = questions[currentQuestion];


  return (

    <div>

      <header className="topbar">

        <div>

          <h1>Quiz</h1>

          <p>
            Question {currentQuestion + 1} of {questions.length}
          </p>

        </div>

      </header>


      <div className="content-grid">

        <div className="panel">

          {/* TIMER */}

          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Time Left: {timeLeft} seconds
          </div>


          {/* QUESTION */}

          <h2>
            {currentQuestion + 1}.{" "}
            {question.question_text}
          </h2>


          {/* MCQ */}

          {question.question_type === "mcq" && (

            <div>

              {["A", "B", "C", "D"].map((option) => (

                <label
                  key={option}
                  style={{
                    display: "block",
                    margin: "15px 0",
                  }}
                >

                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={
                      answers[question.id] === option
                    }
                    onChange={() =>
                      handleAnswerChange(
                        question.id,
                        option
                      )
                    }
                  />

                  {" "}

                  {option}.{" "}
                  {question[
                    `option_${option.toLowerCase()}`
                  ]}

                </label>

              ))}

            </div>

          )}


          {/* TRUE / FALSE */}

          {question.question_type === "true_false" && (

            <div>

              {["True", "False"].map((option) => (

                <label
                  key={option}
                  style={{
                    display: "block",
                    margin: "15px 0",
                  }}
                >

                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={
                      answers[question.id] === option
                    }
                    onChange={() =>
                      handleAnswerChange(
                        question.id,
                        option
                      )
                    }
                  />

                  {" "}

                  {option}

                </label>

              ))}

            </div>

          )}


          {/* FILL IN THE BLANK */}

          {question.question_type === "fill_blank" && (

            <input
              type="text"
              placeholder="Enter your answer"
              value={answers[question.id] || ""}
              onChange={(e) =>
                handleAnswerChange(
                  question.id,
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "20px",
              }}
            />

          )}


          {/* NEXT BUTTON */}

          <button
            className="primary-button"
            onClick={goToNextQuestion}
            style={{
              marginTop: "30px",
            }}
          >
            {currentQuestion === questions.length - 1
              ? "Finish"
              : "Next Question"}
          </button>

        </div>

      </div>

    </div>

  );
}

export default QuizAttempt;
