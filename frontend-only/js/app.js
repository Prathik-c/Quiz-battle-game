const API_BASE = 'http://localhost:8080';

// State
let currentUser = null;
let isLogin = true;
let currentQuiz = null;
let currentGame = null;
let ws = null;

// DOM Elements
const appShell = document.querySelector('.app-shell');
const authBtn = document.getElementById('authBtn');
const currentUserEl = document.getElementById('currentUser');
const userAvatar = document.getElementById('userAvatar');
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const authUsername = document.getElementById('authUsername');
const authPassword = document.getElementById('authPassword');
const authTitle = document.getElementById('authTitle');
const authSwitch = document.getElementById('authSwitch');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');
const quizList = document.getElementById('quizList');
const toastEl = document.getElementById('toast');

// Navigation
document.querySelectorAll('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const screen = btn.dataset.screen;
    switchScreen(screen);
    document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

function switchScreen(screenName) {
  document.querySelectorAll('main > .screen').forEach((s) => s.classList.remove('active'));
  const screen = document.getElementById(screenName);
  if (screen) screen.classList.add('active');
  if (screenName === 'quizzes') loadQuizzes();
  if (screenName === 'admin') loadAdminQuizzes();
}

// Toast notifications
function showToast(message, duration = 3000) {
  toastEl.textContent = message;
  toastEl.classList.remove('hidden');
  setTimeout(() => toastEl.classList.add('hidden'), duration);
}

// API helper
async function apiCall(path, method = 'GET', body = null) {
  try {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(API_BASE + path, opts);
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    if (!res.ok) {
      console.error(`API error: ${res.status}`, text);
      throw new Error(json?.message || `HTTP ${res.status}`);
    }
    return json;
  } catch (e) {
    console.error('API call failed:', e);
    throw e;
  }
}

// Auth
authBtn.addEventListener('click', () => {
  authModal.classList.remove('hidden');
});

authSwitch.addEventListener('click', () => {
  isLogin = !isLogin;
  authTitle.textContent = isLogin ? 'Login' : 'Register';
  authSwitch.textContent = isLogin ? 'Register' : 'Login';
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = authUsername.value.trim();
  const password = authPassword.value.trim();
  if (!username || !password) {
    showToast('Username and password required');
    return;
  }

  try {
    // Simulated auth — backend doesn't have auth endpoints, so just store locally
    currentUser = { id: Date.now(), username };
    userAvatar.textContent = username.charAt(0).toUpperCase();
    currentUserEl.textContent = username;
    authModal.classList.add('hidden');
    authUsername.value = '';
    authPassword.value = '';
    showToast(`Welcome, ${username}!`);
  } catch (e) {
    showToast(`Auth failed: ${e.message}`);
  }
});

// Quizzes
async function loadQuizzes() {
  quizList.innerHTML = '<p>Loading quizzes...</p>';
  try {
    const quizzes = await apiCall('/quizzes');
    if (!quizzes || quizzes.length === 0) {
      quizList.innerHTML = '<p>No quizzes available.</p>';
      return;
    }

    quizList.innerHTML = '';
    quizzes.forEach((quiz) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h3>${quiz.title}</h3><p>${quiz.description || 'No description'}</p><div class="card-meta">${quiz.id}</div>`;
      card.addEventListener('click', () => selectQuizForGame(quiz));
      quizList.appendChild(card);
    });
  } catch (e) {
    quizList.innerHTML = `<p style="color: #ef4444;">Failed to load: ${e.message}</p>`;
  }
}

function selectQuizForGame(quiz) {
  currentQuiz = quiz;
  document.getElementById('lobbyTitle').textContent = quiz.title;
  document.getElementById('lobbyDesc').textContent = quiz.description || 'No description';
  const questionCount = quiz.questions ? quiz.questions.length : 0;
  document.getElementById('lobbyCount').textContent = `${questionCount} questions`;
  switchScreen('lobby');
}

// Game flow
document.getElementById('backBtn').addEventListener('click', () => {
  switchScreen('quizzes');
});

document.getElementById('createGameBtn').addEventListener('click', async () => {
  if (!currentUser) {
    showToast('Please login first');
    return;
  }
  if (!currentQuiz) {
    showToast('No quiz selected');
    return;
  }

  try {
    currentGame = await apiCall(`/games/create/${currentQuiz.id}`, 'POST');
    document.getElementById('startGameBtn').disabled = false;
    showToast('Game created! Ready to start.');
  } catch (e) {
    showToast(`Failed to create game: ${e.message}`);
  }
});

document.getElementById('startGameBtn').addEventListener('click', async () => {
  if (!currentGame) {
    showToast('No game created');
    return;
  }

  try {
    await apiCall(`/games/start/${currentGame.id}`, 'PUT');
    showToast('Game started!');
    loadGamePlay();
    switchScreen('play');
  } catch (e) {
    showToast(`Failed to start game: ${e.message}`);
  }
});

async function loadGamePlay() {
  try {
    const game = await apiCall(`/games/${currentGame.id}`);
    currentGame = game;
    document.getElementById('playTitle').textContent = currentQuiz.title;

    if (game.currentQuestionIndex >= (game.quiz?.questions?.length || 0)) {
      showResults();
      return;
    }

    const question = game.quiz?.questions?.[game.currentQuestionIndex];
    if (question) {
      document.getElementById('questionText').textContent = question.questionText || 'Question';
      const optionsDiv = document.getElementById('options');
      optionsDiv.innerHTML = '';

      // Build options from optionA, optionB, optionC, optionD
      const options = [
        { label: 'A', text: question.optionA },
        { label: 'B', text: question.optionB },
        { label: 'C', text: question.optionC },
        { label: 'D', text: question.optionD }
      ].filter(o => o.text);

      options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.textContent = `${opt.label}. ${opt.text}`;
        btn.addEventListener('click', () => submitAnswer(question.id, opt.label, btn));
        optionsDiv.appendChild(btn);
      });

      startTimer();
    }
  } catch (e) {
    showToast(`Failed to load game: ${e.message}`);
  }
}

let timerInterval;

function startTimer() {
  let seconds = 30;
  document.getElementById('timer').textContent = seconds;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds--;
    document.getElementById('timer').textContent = seconds;
    if (seconds <= 0) {
      clearInterval(timerInterval);
      loadGamePlay(); // Auto-advance
    }
  }, 1000);
}

async function submitAnswer(questionId, optionId, buttonEl) {
  try {
    clearInterval(timerInterval);
    const response = await apiCall(`/answers`, 'POST', {
      gameId: currentGame.id,
      questionId,
      optionId,
    });

    if (response.correct) {
      buttonEl.classList.add('correct');
      showToast('Correct! +10 points');
    } else {
      buttonEl.classList.add('incorrect');
      showToast('Incorrect.');
    }

    setTimeout(() => {
      currentGame.currentQuestionIndex++;
      loadGamePlay();
    }, 1500);
  } catch (e) {
    showToast(`Error submitting answer: ${e.message}`);
  }
}

function showResults() {
  switchScreen('results');
  try {
    const resultsDiv = document.getElementById('resultsContent');
    resultsDiv.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <h3>Game Over!</h3>
        <p style="font-size: 2rem; color: var(--accent); margin: 1rem 0;">${currentGame.score || 0} points</p>
        <p>Questions answered: ${currentGame.currentQuestionIndex || 0}</p>
      </div>
    `;
  } catch (e) {
    console.error('Results error:', e);
  }
}

document.getElementById('returnBtn').addEventListener('click', () => {
  currentGame = null;
  switchScreen('quizzes');
});

// Admin
async function loadAdminQuizzes() {
  try {
    const quizzes = await apiCall('/quizzes');
    const adminList = document.getElementById('adminQuizList');
    adminList.innerHTML = '';
    quizzes.forEach((q) => {
      const item = document.createElement('div');
      item.style.cssText = 'padding: 0.5rem; border-bottom: 1px solid var(--border);';
      item.innerHTML = `<strong>${q.title}</strong> <span style="font-size: 0.8rem; color: #999;">ID: ${q.id}</span>`;
      adminList.appendChild(item);
    });
  } catch (e) {
    document.getElementById('adminQuizList').innerHTML = `<p style="color: #ef4444;">Failed to load: ${e.message}</p>`;
  }
}

document.getElementById('createQuizForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('newQuizTitle').value.trim();
  const description = document.getElementById('newQuizDesc').value.trim();
  if (!title) {
    showToast('Title required');
    return;
  }

  try {
    await apiCall('/quizzes', 'POST', { title, description });
    showToast('Quiz created!');
    document.getElementById('newQuizTitle').value = '';
    document.getElementById('newQuizDesc').value = '';
    loadAdminQuizzes();
  } catch (e) {
    showToast(`Failed to create quiz: ${e.message}`);
  }
});

// Search
searchInput.addEventListener('input', async () => {
  const query = searchInput.value.toLowerCase();
  if (!query) {
    loadQuizzes();
    return;
  }
  try {
    const quizzes = await apiCall('/quizzes');
    const filtered = quizzes.filter(
      (q) =>
        q.title.toLowerCase().includes(query) ||
        (q.description && q.description.toLowerCase().includes(query))
    );
    quizList.innerHTML = '';
    if (filtered.length === 0) {
      quizList.innerHTML = '<p>No quizzes match your search.</p>';
      return;
    }
    filtered.forEach((quiz) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h3>${quiz.title}</h3><p>${quiz.description || 'No description'}</p><div class="card-meta">${quiz.id}</div>`;
      card.addEventListener('click', () => selectQuizForGame(quiz));
      quizList.appendChild(card);
    });
  } catch (e) {
    showToast(`Search failed: ${e.message}`);
  }
});

refreshBtn.addEventListener('click', () => {
  searchInput.value = '';
  loadQuizzes();
});

// Init
loadQuizzes();

