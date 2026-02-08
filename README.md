# Quiz Battle ⚔️

A real-time multiplayer quiz game built with **Spring Boot** backend and **vanilla JavaScript** frontend.

## 📁 Project Structure

```
quiz-battle/
├── backend/              # Spring Boot REST API + WebSocket server
│   ├── src/
│   ├── pom.xml
│   └── mvnw              # Maven wrapper for building
│
├── frontend-only/        # Standalone frontend (Player + Admin UI)
│   ├── index.html        # Main entry point
│   ├── css/              # Styling
│   └── js/               # Client logic
│
└── README.md
```

## 🚀 Quick Start

### Backend
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs on **http://localhost:8080**

API endpoints:
- `GET /quizzes` - List all quizzes
- `POST /quizzes` - Create a quiz
- `GET /questions/quiz/{id}` - Get questions for a quiz
- `POST /games/create/{quizId}` - Create a game session
- `PUT /games/start/{gameId}` - Start a game
- `POST /answers` - Submit an answer
- `GET /games/{gameId}` - Get game state

### Frontend
```bash
cd frontend-only
python -m http.server 5500
```
Frontend runs on **http://localhost:5500**

**Features:**
- Player mode: Browse quizzes → Create game → Play → View results
- Admin mode: Create new quizzes
- Real-time score tracking
- 30-second timer per question
- Search quizzes

## 📋 Requirements

- **Java 17+**
- **MySQL 8.0+**
- **Python 3.7+** (for frontend dev server)

## 🛠️ Technology Stack

**Backend:**
- Spring Boot 3.3.4
- Spring Data JPA / Hibernate
- MySQL with HikariCP
- REST API + WebSocket (STOMP)
- CORS enabled

**Frontend:**
- HTML5
- CSS3 (Dark theme)
- Vanilla JavaScript
- SockJS + Stomp.js (WebSocket)

## 📝 Database Schema

Key entities:
- **Quiz** - Quiz title, description, and questions
- **Question** - Question text with options A/B/C/D and correct answer
- **GameSession** - Active game with quiz, current question, score, status
- **Answer** - Tracks player answers during gameplay
- **User** (optional for future auth)

## 🔧 Configuration

Edit `backend/src/main/resources/application.properties` to configure:
- Database connection
- Server port
- CORS origins

## 📦 Building for Production

```bash
cd backend
./mvnw clean package
```
JAR output: `backend/target/quizbattle-0.0.1-SNAPSHOT.jar`

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test both backend and frontend
4. Commit and push

## 📄 License

MIT
