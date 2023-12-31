import React, { useEffect, useState } from "react";
import { HashRouter, Link, Route, Routes, useNavigate } from "react-router-dom";

function FrontPage() {
  return (
    <>
      <h2>Welcome</h2>
      <Link to={"/question"}>Ask a question</Link>
    </>
  );
}

function QuestionAnswerButton({ answer, onClick }) {
  return (
    <div>
      <button onClick={onClick}>{answer}</button>
    </div>
  );
}

export function Question({ question, onClickAnswer }) {
  if (!question) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <h2>Please try to answer this</h2>
      <p>{question.question}</p>
      {Object.keys(question.answers)
        .filter((k) => question.answers[k])
        .map((k) => (
          <QuestionAnswerButton
            key={k}
            answer={question.answers[k]}
            onClick={() => onClickAnswer(question.id, k)}
          />
        ))}
    </>
  );
}

function ShowAnswer({ onAskAnother }) {
  return (
    <>
      <Routes>
        <Route path={"/correct"} element={<h2>Correct answer</h2>} />
        <Route path={"/wrong"} element={<h2>Wrong answer</h2>} />
      </Routes>
      <div>
        <button onClick={onAskAnother}>Ask another question</button>
      </div>
    </>
  );
}

function ShowScore() {
  const [score, setScore] = useState(undefined);
  async function fetchScore() {
    const res = await fetch("/api/score");
    setScore(await res.json());
  }

  useEffect(() => {
    fetchScore();
  }, []);

  if (!score) {
    return <div>Loading..</div>;
  }

  return (
    <>
      <h2>
        You have {score.correct_answers} out of {score.answers} correct answers
      </h2>
    </>
  );
}

function Quiz() {
  const [question, setQuestion] = useState();

  async function fetchRandomQuestion() {
    const res = await fetch("/api/questions/random");
    setQuestion(await res.json());
  }

  useEffect(() => {
    fetchRandomQuestion();
  }, []);

  const navigateFn = useNavigate();

  async function handleClickAnswer(id, answer) {
    const res = await fetch("/api/questions/answer", {
      method: "POST",
      body: JSON.stringify({ id, answer }),
      headers: {
        "content-type": "application/json",
      },
    });
    const response = await res.json();
    if (response.correct) {
      navigateFn("/answer/correct");
    } else {
      navigateFn("/answer/wrong");
    }
  }

  async function handleAskAnother() {
    await fetchRandomQuestion();
    navigateFn("/question");
  }

  return (
    <Routes>
      <Route path={"/"} element={<FrontPage />} />
      <Route
        path={"/answer/*"}
        element={<ShowAnswer onAskAnother={handleAskAnother} />}
      />
      <Route
        path={"/question"}
        element={
          <Question question={question} onClickAnswer={handleClickAnswer} />
        }
      />
      <Route path={"/score"} element={<ShowScore />} />
      <Route path={"*"} element={<h2>Not found</h2>} />
    </Routes>
  );
}
export function Application() {
  return (
    <HashRouter>
      <header>
        <h1>The quiz application</h1>
      </header>
      <nav>
        <Link to={"/"}>Front page</Link>
        <Link to={"/score"}>See my score</Link>
      </nav>
      <main>
        <Quiz />
      </main>
      <footer>Created by Henrik</footer>
    </HashRouter>
  );
}
