import { useState } from "react";
import QuizList from "./components/QuizList";
import GamePlay from "./components/GamePlay";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";

const API = "http://localhost:8080";

export default function App() {
  const [view, setView] = useState("home"); // home | game | admin
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand" onClick={() => setView("home")}>
          <span className="brand-icon">⚔</span>
          <span className="brand-name">Quiz<span className="brand-accent">Battle</span></span>
        </div>
        <div className="nav-links">
          <button className={`nav-btn ${view === "home" ? "active" : ""}`} onClick={() => setView("home")}>Play</button>
          <button className={`nav-btn ${view === "admin" ? "active" : ""}`} onClick={() => setView("admin")}>Admin</button>
        </div>
      </nav>

      <main className="main">
        {view === "home" && (
          <QuizList
            API={API}
            onStartGame={(game) => { setActiveGame(game); setView("game"); }}
          />
        )}
        {view === "game" && activeGame && (
          <GamePlay
            API={API}
            game={activeGame}
            onExit={() => { setActiveGame(null); setView("home"); }}
          />
        )}
        {view === "admin" && <AdminDashboard API={API} />}
      </main>
    </div>
  );
}