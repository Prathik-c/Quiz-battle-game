import { useState, useEffect } from "react";

const TABS = [
  { key: "quizzes", label: "Quizzes", icon: "📋" },
  { key: "questions", label: "Questions", icon: "❓" },
];

async function api(url, method = "GET", body = null) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(res.statusText);
  const text = await res.text();
  return text ? JSON.parse(text) : true;
}

function Toast({ toasts, remove }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.msg}
          <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", marginLeft: "auto" }}>×</button>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard({ API }) {
  const [tab, setTab] = useState("quizzes");
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [quizModal, setQuizModal] = useState(null); // null | {} | existing quiz
  const [qModal, setQModal] = useState(null);

  function toast(msg, type = "success") {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }

  async function loadQuizzes() {
    setLoading(true);
    try { setQuizzes(await api(`${API}/quizzes`)); }
    catch { toast("Failed to load quizzes", "error"); }
    finally { setLoading(false); }
  }

  async function loadQuestions() {
    setLoading(true);
    try {
      const qzs = await api(`${API}/quizzes`);
      setQuizzes(qzs);
      let all = [];
      qzs.forEach(q => {
        if (q.questions) all = [...all, ...q.questions.map(x => ({ ...x, quizTitle: q.title, quizId: q.id }))];
      });
      setQuestions(all);
    } catch { toast("Failed to load questions", "error"); }
    finally { setLoading(false); }
  }

  useEffect(() => { tab === "quizzes" ? loadQuizzes() : loadQuestions(); }, [tab]);

  async function deleteQuiz(id) {
    if (!confirm("Delete this quiz and all its data?")) return;
    try { await api(`${API}/quizzes/${id}`, "DELETE"); toast("Quiz deleted"); loadQuizzes(); }
    catch { toast("Failed to delete quiz", "error"); }
  }

  async function deleteQuestion(id) {
    if (!confirm("Delete this question?")) return;
    try { await api(`${API}/questions/${id}`, "DELETE"); toast("Question deleted"); loadQuestions(); }
    catch { toast("Failed to delete question", "error"); }
  }

  async function saveQuiz(data) {
    try {
      if (data.id) { await api(`${API}/quizzes/${data.id}`, "PUT", data); toast("Quiz updated"); }
      else { await api(`${API}/quizzes`, "POST", data); toast("Quiz created"); }
      setQuizModal(null); loadQuizzes();
    } catch { toast("Failed to save quiz", "error"); }
  }

  async function saveQuestion(data) {
    try {
      if (data.id) { await api(`${API}/questions/${data.id}`, "PUT", data); toast("Question updated"); }
      else { await api(`${API}/questions`, "POST", data); toast("Question created"); }
      setQModal(null); loadQuestions();
    } catch { toast("Failed to save question", "error"); }
  }

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-sub">Manage quizzes and questions</p>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          {TABS.map(t => (
            <div key={t.key} className={`sidebar-item ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
              <span>{t.icon}</span> {t.label}
            </div>
          ))}
        </aside>

        <div>
          {tab === "quizzes" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.1rem", fontWeight: 600 }}>Quizzes</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setQuizModal({})}>+ New Quiz</button>
              </div>
              {loading ? <div className="loading"><div className="spinner" /></div> : (
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Title</th><th>Description</th><th>Questions</th><th>Actions</th></tr></thead>
                      <tbody>
                        {quizzes.length === 0 ? (
                          <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text3)", padding: "2rem" }}>No quizzes yet</td></tr>
                        ) : quizzes.map(q => (
                          <tr key={q.id}>
                            <td style={{ fontWeight: 500 }}>{q.title}</td>
                            <td style={{ color: "var(--text2)" }}>{q.description || "-"}</td>
                            <td><span className="badge badge-accent">{q.questions?.length || 0}</span></td>
                            <td>
                              <div className="table-actions">
                                <button className="btn btn-secondary btn-sm" onClick={() => setQuizModal(q)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteQuiz(q.id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "questions" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.1rem", fontWeight: 600 }}>Questions</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setQModal({})}>+ New Question</button>
              </div>
              {loading ? <div className="loading"><div className="spinner" /></div> : (
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Question</th><th>Quiz</th><th>Answer</th><th>Actions</th></tr></thead>
                      <tbody>
                        {questions.length === 0 ? (
                          <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text3)", padding: "2rem" }}>No questions yet</td></tr>
                        ) : questions.map(q => (
                          <tr key={q.id}>
                            <td style={{ maxWidth: 280 }}>{q.questionText?.substring(0, 60)}{q.questionText?.length > 60 ? "..." : ""}</td>
                            <td style={{ color: "var(--text2)" }}>{q.quizTitle}</td>
                            <td><span className="badge badge-success">{q.correctAnswer}</span></td>
                            <td>
                              <div className="table-actions">
                                <button className="btn btn-secondary btn-sm" onClick={() => setQModal({ ...q })}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteQuestion(q.id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {quizModal !== null && <QuizModal quiz={quizModal} onSave={saveQuiz} onClose={() => setQuizModal(null)} />}
      {qModal !== null && <QuestionModal question={qModal} quizzes={quizzes} onSave={saveQuestion} onClose={() => setQModal(null)} />}

      <Toast toasts={toasts} remove={id => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  );
}

function QuizModal({ quiz, onSave, onClose }) {
  const [title, setTitle] = useState(quiz.title || "");
  const [desc, setDesc] = useState(quiz.description || "");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{quiz.id ? "Edit Quiz" : "New Quiz"}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Quiz title" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Optional description" />
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave({ ...quiz, title, description: desc })}>Save</button>
        </div>
      </div>
    </div>
  );
}

function QuestionModal({ question, quizzes, onSave, onClose }) {
  const [form, setForm] = useState({
    questionText: question.questionText || "",
    optionA: question.optionA || "",
    optionB: question.optionB || "",
    optionC: question.optionC || "",
    optionD: question.optionD || "",
    correctAnswer: question.correctAnswer || "",
    quizId: question.quizId || "",
  });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{question.id ? "Edit Question" : "New Question"}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="form-group">
          <label className="form-label">Quiz</label>
          <select className="form-select" value={form.quizId} onChange={e => set("quizId", e.target.value)}>
            <option value="">Select quiz</option>
            {quizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Question</label>
          <textarea className="form-textarea" value={form.questionText} onChange={e => set("questionText", e.target.value)} placeholder="Enter question text" />
        </div>
        <div className="form-row">
          {["A","B","C","D"].map(l => (
            <div className="form-group" key={l}>
              <label className="form-label">Option {l}</label>
              <input className="form-input" value={form[`option${l}`]} onChange={e => set(`option${l}`, e.target.value)} placeholder={`Option ${l}`} />
            </div>
          ))}
        </div>
        <div className="form-group">
          <label className="form-label">Correct Answer</label>
          <select className="form-select" value={form.correctAnswer} onChange={e => set("correctAnswer", e.target.value)}>
            <option value="">Select correct option</option>
            {["A","B","C","D"].map(l => <option key={l} value={l}>Option {l}</option>)}
          </select>
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave({
            ...question,
            ...form,
            quiz: { id: parseInt(form.quizId) }
          })}>Save</button>
        </div>
      </div>
    </div>
  );
}