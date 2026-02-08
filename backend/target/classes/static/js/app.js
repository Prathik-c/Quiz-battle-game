// ===== API Configuration =====
const API_BASE_URL = 'http://localhost:8080';
const WS_BASE_URL = 'ws://localhost:8080';

// ===== Application State =====
const appState = {
    currentUser: null,
    currentQuiz: null,
    currentGame: null,
    currentQuestion: null,
    questionIndex: 0,
    score: 0,
    stompClient: null,
    gameTimer: null,
    selectedAnswer: null,
};

// ===== DOM Elements =====
const authModal = document.getElementById('authModal');
const appContainer = document.getElementById('appContainer');
const currentUserSpan = document.getElementById('currentUser');
const logoutBtn = document.getElementById('logoutBtn');

// ===== Screen Elements =====
const screens = {
    quizSelection: document.getElementById('quizSelectionScreen'),
    gameLobby: document.getElementById('gameLobbyScreen'),
    gamePlay: document.getElementById('gamePlayScreen'),
    gameResults: document.getElementById('gameResultsScreen'),
};

// ===== Utility Functions =====
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function switchScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        showToast(error.message, 'error');
        return null;
    }
}

// ===== Authentication Functions =====
function switchAuthTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showToast('Please fill in all fields', 'warning');
        return;
    }

    // Simulate login - In production, validate against backend
    appState.currentUser = {
        id: Math.floor(Math.random() * 10000),
        username: username,
    };

    currentUserSpan.textContent = username;
    authModal.classList.add('hidden');
    appContainer.classList.remove('hidden');

    showToast(`Welcome back, ${username}!`, 'success');
    loadQuizzes();

    document.getElementById('loginForm').reset();
}

async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const email = document.getElementById('regEmail').value;

    if (!username || !password || !email) {
        showToast('Please fill in all fields', 'warning');
        return;
    }

    // Simulate registration - In production, send to backend
    appState.currentUser = {
        id: Math.floor(Math.random() * 10000),
        username: username,
        email: email,
    };

    currentUserSpan.textContent = username;
    authModal.classList.add('hidden');
    appContainer.classList.remove('hidden');

    showToast(`Welcome, ${username}! Account created successfully.`, 'success');
    loadQuizzes();

    document.getElementById('registerForm').reset();
}

function handleLogout() {
    appState.currentUser = null;
    appState.currentGame = null;
    appState.score = 0;

    if (appState.stompClient && appState.stompClient.connected) {
        appState.stompClient.disconnect(() => {
            console.log('Disconnected from WebSocket');
        });
    }

    authModal.classList.remove('hidden');
    appContainer.classList.add('hidden');

    switchAuthTab('login');
    showToast('Logged out successfully', 'success');
}

// ===== Quiz Functions =====
async function loadQuizzes() {
    const quizList = document.getElementById('quizList');
    quizList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Loading quizzes...</p>';

    const quizzes = await apiCall('/quizzes');

    if (!quizzes) {
        quizList.innerHTML = '<p style="text-align: center; color: var(--error-color);">Failed to load quizzes</p>';
        return;
    }

    if (quizzes.length === 0) {
        quizList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No quizzes available</p>';
        return;
    }

    quizList.innerHTML = quizzes
        .map(
            quiz => `
        <div class="quiz-card" onclick="selectQuiz(${quiz.id})">
            <h3>${quiz.title}</h3>
            <p>${quiz.description || 'No description available'}</p>
            <div class="quiz-meta">
                <span>📝 ${quiz.questions ? quiz.questions.length : 0} Questions</span>
                <span>⭐ Medium</span>
            </div>
        </div>
    `
        )
        .join('');
}

async function selectQuiz(quizId) {
    const quizzes = await apiCall('/quizzes');
    const quiz = quizzes.find(q => q.id === quizId);

    if (!quiz) {
        showToast('Quiz not found', 'error');
        return;
    }

    appState.currentQuiz = quiz;

    // Update lobby
    document.getElementById('lobbyQuizTitle').textContent = quiz.title;
    document.getElementById('lobbyDescription').textContent = quiz.description || 'No description';
    document.getElementById('questionCount').textContent = quiz.questions ? quiz.questions.length : 0;

    switchScreen('gameLobby');
}

// ===== Game Functions =====
async function startGame() {
    if (!appState.currentQuiz) {
        showToast('Quiz not selected', 'error');
        return;
    }

    // Create game session
    const gameSession = await apiCall(`/games/create/${appState.currentQuiz.id}`, 'POST');

    if (!gameSession) {
        showToast('Failed to create game session', 'error');
        return;
    }

    appState.currentGame = gameSession;
    appState.questionIndex = 0;
    appState.score = 0;
    appState.selectedAnswer = null;

    // Start the game
    const startedGame = await apiCall(`/games/start/${gameSession.id}`, 'PUT');

    if (!startedGame) {
        showToast('Failed to start game', 'error');
        return;
    }

    // Initialize WebSocket connection
    initializeWebSocket();

    // Load first question
    loadNextQuestion();

    switchScreen('gamePlay');
}

function loadNextQuestion() {
    const questions = appState.currentQuiz.questions;

    if (!questions || appState.questionIndex >= questions.length) {
        endGame();
        return;
    }

    appState.currentQuestion = questions[appState.questionIndex];
    appState.selectedAnswer = null;

    // Update question display
    document.getElementById('questionText').textContent = appState.currentQuestion.questionText;
    document.getElementById('questionNumber').textContent = appState.questionIndex + 1;
    document.getElementById('totalQuestions').textContent = questions.length;
    document.getElementById('gameQuizTitle').textContent = appState.currentQuiz.title;

    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    const options = [
        { label: 'A', text: appState.currentQuestion.optionA },
        { label: 'B', text: appState.currentQuestion.optionB },
        { label: 'C', text: appState.currentQuestion.optionC },
        { label: 'D', text: appState.currentQuestion.optionD },
    ];

    optionsContainer.innerHTML = options
        .map(
            (option, index) => `
        <div class="option" onclick="selectOption('${option.label}', this)">
            <strong>${option.label}.</strong> ${option.text}
        </div>
    `
        )
        .join('');

    // Start timer
    startQuestionTimer();
}

function selectOption(option, element) {
    if (appState.selectedAnswer) {
        return; // Already answered
    }

    appState.selectedAnswer = option;
    element.classList.add('selected');

    // Send answer to WebSocket
    if (appState.stompClient && appState.stompClient.connected) {
        const answerMessage = {
            gameId: appState.currentGame.id,
            userId: appState.currentUser.id,
            questionId: appState.currentQuestion.id,
            selectedOption: option,
        };

        appState.stompClient.send('/app/answer', {}, JSON.stringify(answerMessage));
    }

    // Disable other options
    document.querySelectorAll('.option').forEach(opt => {
        opt.style.pointerEvents = 'none';
    });

    // Check answer
    const isCorrect = option === appState.currentQuestion.correctAnswer;

    setTimeout(() => {
        if (isCorrect) {
            element.classList.add('correct');
            appState.score += 10;
            document.getElementById('myScore').textContent = appState.score;
            showToast('Correct! 🎉', 'success');
        } else {
            element.classList.add('incorrect');
            // Highlight correct answer
            document.querySelectorAll('.option').forEach(opt => {
                if (opt.textContent.includes(appState.currentQuestion.correctAnswer)) {
                    opt.classList.add('correct');
                }
            });
            showToast('Incorrect! ❌', 'warning');
        }

        setTimeout(() => {
            appState.questionIndex++;
            clearInterval(appState.gameTimer);
            loadNextQuestion();
        }, 2000);
    }, 500);
}

function startQuestionTimer() {
    let timeLeft = 30;
    document.getElementById('timer').textContent = timeLeft;

    clearInterval(appState.gameTimer);

    appState.gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(appState.gameTimer);

            if (!appState.selectedAnswer) {
                showToast('Time\'s up! Moving to next question...', 'warning');
                appState.questionIndex++;
                loadNextQuestion();
            }
        }
    }, 1000);
}

async function endGame() {
    clearInterval(appState.gameTimer);

    // Complete game session
    if (appState.currentGame) {
        await apiCall(`/games/complete/${appState.currentGame.id}`, 'PUT');
    }

    // Display results
    const totalQuestions = appState.currentQuiz.questions.length;
    const correctCount = Math.floor((appState.score / 10) / totalQuestions * totalQuestions);
    const accuracy = Math.floor((appState.score / (totalQuestions * 10)) * 100);

    document.getElementById('finalScore').textContent = appState.score;
    document.getElementById('correctCount').textContent = Math.floor(appState.score / 10);
    document.getElementById('accuracy').textContent = accuracy + '%';

    // Display leaderboard (simulated)
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = `
        <div class="leaderboard-item">
            <span class="leaderboard-rank">1</span>
            <span class="leaderboard-name">${appState.currentUser.username} (You)</span>
            <span class="leaderboard-score">${appState.score} pts</span>
        </div>
        <div class="leaderboard-item">
            <span class="leaderboard-rank">2</span>
            <span class="leaderboard-name">Player Two</span>
            <span class="leaderboard-score">${appState.score - 20} pts</span>
        </div>
        <div class="leaderboard-item">
            <span class="leaderboard-rank">3</span>
            <span class="leaderboard-name">Player Three</span>
            <span class="leaderboard-score">${appState.score - 40} pts</span>
        </div>
    `;

    switchScreen('gameResults');
}

// ===== WebSocket Functions =====
function initializeWebSocket() {
    const SockJS = window.SockJS || function(url) {
        return new WebSocket(url);
    };

    const socket = new SockJS(`${WS_BASE_URL}/ws`);

    appState.stompClient = Stomp.over(socket);

    appState.stompClient.connect({}, function() {
        console.log('Connected to WebSocket');

        // Subscribe to game updates
        appState.stompClient.subscribe(`/topic/game/${appState.currentGame.id}`, function(message) {
            const response = message.body;
            console.log('Game update:', response);

            // Add to score updates panel
            const scoreUpdates = document.getElementById('scoreUpdates');
            const update = document.createElement('div');
            update.className = 'score-update';
            update.textContent = response;
            scoreUpdates.insertBefore(update, scoreUpdates.firstChild);

            // Keep only last 5 updates
            while (scoreUpdates.children.length > 5) {
                scoreUpdates.removeChild(scoreUpdates.lastChild);
            }
        });
    });
}

// ===== Event Listeners =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        switchAuthTab(e.target.dataset.tab);
    });
});

document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('registerForm').addEventListener('submit', handleRegister);
logoutBtn.addEventListener('click', handleLogout);

document.getElementById('refreshQuizzesBtn').addEventListener('click', loadQuizzes);
document.getElementById('backToQuizzesBtn').addEventListener('click', () => switchScreen('quizSelection'));
document.getElementById('startGameBtn').addEventListener('click', startGame);
document.getElementById('playAgainBtn').addEventListener('click', () => {
    switchScreen('gameLobby');
});
document.getElementById('backToQuizzesFromResultsBtn').addEventListener('click', () => {
    switchScreen('quizSelection');
    loadQuizzes();
});

// ===== Load Stomp Client Library =====
// Note: Add <script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
// and <script src="https://cdn.jsdelivr.net/npm/stompjs@2.3.3/lib/stomp.min.js"></script> to HTML

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
});
