# 🎮 Quiz Battle

A **real-time multiplayer quiz platform** where players can create, host, and compete in live quiz sessions. Built with a Spring Boot REST + WebSocket backend and a React frontend.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.3.4 |
| Real-time | WebSocket (STOMP over SockJS) |
| Database | MySQL 8.0 + Spring Data JPA / Hibernate |
| Connection Pool | HikariCP |
| Frontend | React (Vite) |
| Build Tool | Maven |

---

## ✨ Features

- 🎯 Create and manage quizzes with multiple-choice questions (A/B/C/D)
- 🔴 Real-time multiplayer game sessions via WebSocket
- ⏱️ 30-second countdown timer per question
- 📊 Live score tracking and leaderboard
- 🔍 Search quizzes by name
- 🌙 Dark-themed responsive UI
- 🔒 CORS configured for cross-origin frontend integration

---

## 📁 Project Structure

```
Quiz-battle-game/
├── backend/                  # Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/com/quizbattle/
│   │       │   ├── controller/       # REST controllers
│   │       │   ├── model/            # JPA entities
│   │       │   ├── repository/       # Spring Data repositories
│   │       │   ├── service/          # Business logic
│   │       │   └── websocket/        # WebSocket config & handlers
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
└── frontend/                 # React frontend
    ├── src/
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Java 17+
- MySQL 8.0+
- Node.js 18+ (for frontend)
- Maven (or use the included `mvnw` wrapper)

### 1. Database Setup

```sql
CREATE DATABASE quizbattle;
```

### 2. Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quizbattle
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
```

### 3. Run Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend starts at **http://localhost:8080**

### 4. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quizzes` | Get all quizzes |
| POST | `/quizzes` | Create a new quiz |
| GET | `/questions/quiz/{id}` | Get questions for a quiz |
| POST | `/games/create/{quizId}` | Create a game session |
| PUT | `/games/start/{gameId}` | Start a game |
| POST | `/answers` | Submit an answer |
| GET | `/games/{gameId}` | Get current game state |

### WebSocket

Connect to: `ws://localhost:8080/ws`

| Topic | Description |
|-------|-------------|
| `/topic/game/{gameId}` | Live game state updates |
| `/app/game/answer` | Submit answer via WebSocket |

---

## 🗄️ Database Schema

| Entity | Description |
|--------|-------------|
| `Quiz` | Quiz title and description |
| `Question` | Question text, options A/B/C/D, correct answer |
| `GameSession` | Active game state, current question, status |
| `Answer` | Player answer submissions per session |

---

## 📸 Demo

> Run locally and open http://localhost:5173 to play.
> Use the Admin panel to create a quiz, then join as a player to start a game session.

---

## 👨‍💻 Author

**Prathik C**  
B.Tech CSE (AI & ML) — JSS Academy of Technical Education  
[GitHub](https://github.com/Prathik-c)
