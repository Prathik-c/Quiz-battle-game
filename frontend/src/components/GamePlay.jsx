import { useState, useEffect, useCallback } from "react";

const LETTERS = ["A", "B", "C", "D"];

export default function GamePlay({ API, game, onExit }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/questions/quiz/${game.quiz?.id || game.quizId}`)
      .then(r => r.json())
      .then(data => { setQuestions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || revealed || done) return;
    setTimer(30);
    const t = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(t); handleReveal(null); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [current, loading, revealed, done]);

  function handleReveal(answer) {
    setSelected(answer);
    setRevealed(true);
    const q = questions[current];
    const correct = q.correctAnswer?.trim().toUpperCase();
    if (answer && answer === correct) setScore(s => s + 1);
  }

  function next() {
    if (current + 1 >= questions.length) { setDone(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setRevealed(false);
  }

  function getOptionClass(letter) {
    if (!revealed) return selected === letter ? "option selected" : "option";
    const correct = questions[current]?.correctAnswer?.trim().toUpperCase();
    if (letter === correct) return "option correct";
    if (letter === selected && letter !== correct) return "option wrong";
    return "option";
  }

  function getOptionText(q, letter) {
    return { A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD }[letter];
  }

  if (loading) return <div className="loading"><div className="spinner" /> Loading questions...</div>;

  if (questions.length === 0) return (
    <div className="empty">
      <div className="empty-icon">❓</div>
      <p>No questions in this quiz yet</p>
      <button className="btn btn-secondary" style={{ marginTop: "1rem" }} onClick={onExit}>Go Back</button>
    </div>
  );

  if (done) return (
    <div className="results-wrap">
      <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <p className="score-label">Final Score</p>
        <div className="score-ring">{score}/{questions.length}</div>
        <p style={{ color: "var(--text2)", marginBottom: "2rem" }}>
          {score === questions.length ? "Perfect! 🎉" : score > questions.length / 2 ? "Great job! 🔥" : "Keep practicing! 💪"}
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={() => { setCurrent(0); setScore(0); setDone(false); setRevealed(false); setSelected(null); }}>
            Play Again
          </button>
          <button className="btn btn-secondary" onClick={onExit}>Back to Quizzes</button>
        </div>
      </div>
    </div>
  );

  const q = questions[current];

  return (
    <div className="game-wrap">
      <div className="game-header">
        <div>
          <div className="game-title">{game.quizTitle}</div>
          <div style={{ color: "var(--text3)", fontSize: "0.85rem" }}>Question {current + 1} of {questions.length}</div>
        </div>
        <div className={`timer ${timer <= 5 ? "urgent" : ""}`}>{timer}s</div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((current) / questions.length) * 100}%` }} />
      </div>

      <div className="question-card">
        <div className="question-num">Question {current + 1}</div>
        <div className="question-text">{q.questionText}</div>
      </div>

      <div className="options">
        {LETTERS.map(letter => (
          <button
            key={letter}
            className={getOptionClass(letter)}
            onClick={() => !revealed && handleReveal(letter)}
            disabled={revealed}
          >
            <span className="option-letter">{letter}</span>
            <span>{getOptionText(q, letter)}</span>
          </button>
        ))}
      </div>

      {revealed && (
        <div style={{ marginTop: "1rem" }}>
          <div className={`feedback ${selected === q.correctAnswer?.trim().toUpperCase() ? "correct" : "wrong"}`}>
            {selected === q.correctAnswer?.trim().toUpperCase()
              ? "✓ Correct!"
              : `✗ Incorrect — Correct answer: ${q.correctAnswer?.trim().toUpperCase()}`
            }
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={next}>
              {current + 1 >= questions.length ? "See Results →" : "Next →"}
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "var(--text3)", fontSize: "0.85rem" }}>Score: {score}/{current + (revealed ? 1 : 0)}</span>
        <button className="btn btn-secondary btn-sm" onClick={onExit}>Exit</button>
      </div>
    </div>
  );
}