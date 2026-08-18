function Quizzes() {
  const quizzes = [
    {
      title: "Python Basics Quiz",
      course: "CS-101",
      questions: 10,
      time: "15 minutes",
    },
    {
      title: "Database Fundamentals",
      course: "CS-201",
      questions: 15,
      time: "20 minutes",
    },
  ];

  return (
    <div>
      <header className="topbar">
        <div>
          <h1>Quizzes</h1>
          <p>Take your available course quizzes</p>
        </div>
      </header>

      <div className="content-grid">
        {quizzes.map((quiz) => (
          <div className="panel" key={quiz.title}>
            <h2>{quiz.title}</h2>
            <p>{quiz.course}</p>

            <br />

            <p>Questions: {quiz.questions}</p>
            <p>Time limit: {quiz.time}</p>

            <br />

            <button className="primary-button">
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Quizzes;