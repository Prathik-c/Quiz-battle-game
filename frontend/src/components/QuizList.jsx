import { useState, useEffect } from "react";

export default function QuizList({ API, onStartGame }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [starting, setStarting] = useState(null);

  useEffect(() => {
    fetch(`${API}/quizzes`)
      .then(r => r.json())
      .then(data => { setQuizzes(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = quizzes.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  async function startGame(quiz) {
    setStarting(quiz.id);
    try {
      const res = await fetch(`${API}/games/create/${quiz.id}`, { method: "POST" });
      const game = await res.json();
      onStartGame({ ...game, quizTitle: quiz.title });
    } catch {
      alert("Failed to start game");
    } finally {
      setStarting(null);
    }
  }

  return (
    <div>
      <div className="hero">
        <h1 className="hero-title">Test Your <span className="hero-accent">Knowledge</span></h1>
        <p className="hero-sub">Pick a quiz, beat the clock, and climb the leaderboard</p>
        <input
          className="form-input"
          style={{ maxWidth: 360, margin: "0 auto", display: "block" }}
          placeholder="Search quizzes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Loading quizzes...</div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <p>No quizzes found</p>
        </div>
      ) : (
        <div className="quiz-grid">
          {filtered.map(quiz => (
            <div key={quiz.id} className="quiz-card" onClick={() => startGame(quiz)}>
              <div>
                <div className="quiz-card-title">{quiz.title}</div>
                {quiz.description && <div className="quiz-card-desc" style={{ marginTop: 6 }}>{quiz.description}</div>}
              </div>
              <div className="quiz-card-meta">
                <span className="badge badge-accent">
                  {quiz.questions?.length || 0} questions
                </span>
                <button className="btn btn-primary btn-sm" disabled={starting === quiz.id}>
                  {starting === quiz.id ? "Starting..." : "Play →"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}