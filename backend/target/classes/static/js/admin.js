// ===== API Configuration =====
const API_BASE_URL = 'http://localhost:8080';

// ===== Application State =====
const adminState = {
    currentUser: null,
    quizzes: [],
    questions: [],
    games: [],
    editingQuiz: null,
    editingQuestion: null,
};

// ===== DOM Elements =====
const logoutBtn = document.getElementById('logoutBtn');
const currentUserSpan = document.getElementById('currentUser');

// ===== Tab Navigation =====
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const tabName = item.dataset.tab;
        switchTab(tabName);
    });
});

function switchTab(tabName) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.tab-section').forEach(section => section.classList.remove('active'));
    document.getElementById(`${tabName}Tab`).classList.add('active');

    // Load data for the tab
    switch (tabName) {
        case 'quizzes':
            loadQuizzes();
            break;
        case 'questions':
            loadQuestions();
            break;
        case 'games':
            loadGames();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

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

// ===== Quiz Management =====
async function loadQuizzes() {
    const quizTable = document.getElementById('quizTable');
    quizTable.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Loading...</td></tr>';

    const quizzes = await apiCall('/quizzes');

    if (!quizzes) {
        quizTable.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--error-color);">Failed to load quizzes</td></tr>';
        return;
    }

    adminState.quizzes = quizzes;

    if (quizzes.length === 0) {
        quizTable.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No quizzes available</td></tr>';
        return;
    }

    quizTable.innerHTML = quizzes
        .map(
            quiz => `
        <tr>
            <td>${quiz.id}</td>
            <td>${quiz.title}</td>
            <td>${quiz.description || '-'}</td>
            <td>${quiz.questions ? quiz.questions.length : 0}</td>
            <td><span style="color: var(--success-color);">●</span> Active</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-secondary" onclick="editQuiz(${quiz.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteQuiz(${quiz.id})">Delete</button>
                </div>
            </td>
        </tr>
    `
        )
        .join('');
}

function openQuizModal(quizId = null) {
    adminState.editingQuiz = quizId;
    const modal = document.getElementById('quizModal');
    const form = document.getElementById('quizForm');

    if (quizId) {
        const quiz = adminState.quizzes.find(q => q.id === quizId);
        if (quiz) {
            document.getElementById('quizTitle').value = quiz.title;
            document.getElementById('quizDescription').value = quiz.description || '';
            modal.querySelector('h2').textContent = 'Edit Quiz';
        }
    } else {
        form.reset();
        modal.querySelector('h2').textContent = 'Create Quiz';
    }

    modal.classList.add('active');
}

function closeQuizModal() {
    document.getElementById('quizModal').classList.remove('active');
    document.getElementById('quizForm').reset();
    adminState.editingQuiz = null;
}

async function handleQuizSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('quizTitle').value;
    const description = document.getElementById('quizDescription').value;

    const quizData = {
        title,
        description,
    };

    if (adminState.editingQuiz) {
        quizData.id = adminState.editingQuiz;
        // In a real app, you'd use PUT to update
        showToast('Quiz updated successfully', 'success');
    } else {
        const quiz = await apiCall('/quizzes', 'POST', quizData);
        if (quiz) {
            showToast('Quiz created successfully', 'success');
            loadQuizzes();
        }
    }

    closeQuizModal();
}

async function editQuiz(quizId) {
    openQuizModal(quizId);
}

async function deleteQuiz(quizId) {
    if (confirm('Are you sure you want to delete this quiz?')) {
        // In a real app, send DELETE request
        showToast('Quiz deleted successfully', 'success');
        loadQuizzes();
    }
}

// ===== Question Management =====
async function loadQuestions() {
    const questionTable = document.getElementById('questionTable');
    questionTable.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Loading...</td></tr>';

    const quizzes = await apiCall('/quizzes');

    if (!quizzes) {
        questionTable.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--error-color);">Failed to load questions</td></tr>';
        return;
    }

    let allQuestions = [];
    quizzes.forEach(quiz => {
        if (quiz.questions) {
            allQuestions = allQuestions.concat(
                quiz.questions.map(q => ({
                    ...q,
                    quizTitle: quiz.title,
                }))
            );
        }
    });

    adminState.questions = allQuestions;

    if (allQuestions.length === 0) {
        questionTable.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No questions available</td></tr>';
        return;
    }

    questionTable.innerHTML = allQuestions
        .map(
            question => `
        <tr>
            <td>${question.id}</td>
            <td>${question.questionText.substring(0, 50)}...</td>
            <td>${question.quizTitle}</td>
            <td>Medium</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-secondary" onclick="editQuestion(${question.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteQuestion(${question.id})">Delete</button>
                </div>
            </td>
        </tr>
    `
        )
        .join('');
}

function openQuestionModal(questionId = null) {
    adminState.editingQuestion = questionId;
    const modal = document.getElementById('questionModal');
    const form = document.getElementById('questionForm');

    // Populate quiz select
    const quizSelect = document.getElementById('questionQuiz');
    quizSelect.innerHTML = '<option value="">Select a quiz</option>';
    adminState.quizzes.forEach(quiz => {
        quizSelect.innerHTML += `<option value="${quiz.id}">${quiz.title}</option>`;
    });

    if (questionId) {
        const question = adminState.questions.find(q => q.id === questionId);
        if (question) {
            quizSelect.value = question.quiz?.id || '';
            document.getElementById('questionText').value = question.questionText;
            document.getElementById('optionA').value = question.optionA || '';
            document.getElementById('optionB').value = question.optionB || '';
            document.getElementById('optionC').value = question.optionC || '';
            document.getElementById('optionD').value = question.optionD || '';
            document.getElementById('correctAnswer').value = question.correctAnswer || '';
            modal.querySelector('h2').textContent = 'Edit Question';
        }
    } else {
        form.reset();
        modal.querySelector('h2').textContent = 'Add Question';
    }

    modal.classList.add('active');
}

function closeQuestionModal() {
    document.getElementById('questionModal').classList.remove('active');
    document.getElementById('questionForm').reset();
    adminState.editingQuestion = null;
}

async function handleQuestionSubmit(e) {
    e.preventDefault();

    const quizId = document.getElementById('questionQuiz').value;
    const questionText = document.getElementById('questionText').value;
    const optionA = document.getElementById('optionA').value;
    const optionB = document.getElementById('optionB').value;
    const optionC = document.getElementById('optionC').value;
    const optionD = document.getElementById('optionD').value;
    const correctAnswer = document.getElementById('correctAnswer').value;

    const questionData = {
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        quiz: { id: quizId },
    };

    if (adminState.editingQuestion) {
        showToast('Question updated successfully', 'success');
    } else {
        // In a real app, send POST request
        showToast('Question created successfully', 'success');
        loadQuestions();
    }

    closeQuestionModal();
}

async function editQuestion(questionId) {
    openQuestionModal(questionId);
}

async function deleteQuestion(questionId) {
    if (confirm('Are you sure you want to delete this question?')) {
        showToast('Question deleted successfully', 'success');
        loadQuestions();
    }
}

// ===== Game Management =====
async function loadGames() {
    const gameTable = document.getElementById('gameTable');
    gameTable.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Loading...</td></tr>';

    const games = await apiCall('/games');

    if (!games) {
        gameTable.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--error-color);">Failed to load games</td></tr>';
        return;
    }

    adminState.games = games;

    if (games.length === 0) {
        gameTable.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No game sessions available</td></tr>';
        return;
    }

    gameTable.innerHTML = games
        .map(
            game => `
        <tr>
            <td>${game.id}</td>
            <td>${game.quiz?.title || '-'}</td>
            <td>${game.playerGames ? game.playerGames.length : 0}</td>
            <td>${game.status || 'Active'}</td>
            <td>${new Date(game.createdAt || Date.now()).toLocaleDateString()}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-secondary" onclick="viewGame(${game.id})">View</button>
                </div>
            </td>
        </tr>
    `
        )
        .join('');
}

// ===== Analytics =====
async function loadAnalytics() {
    const quizzes = await apiCall('/quizzes');
    const games = await apiCall('/games');

    let totalQuestions = 0;
    quizzes.forEach(quiz => {
        if (quiz.questions) {
            totalQuestions += quiz.questions.length;
        }
    });

    document.getElementById('totalQuizzes').textContent = quizzes ? quizzes.length : 0;
    document.getElementById('totalQuestions').textContent = totalQuestions;
    document.getElementById('activeGames').textContent = games
        ? games.filter(g => g.status === 'ACTIVE').length
        : 0;
    document.getElementById('totalPlayers').textContent = games
        ? games.reduce((sum, g) => sum + (g.playerGames ? g.playerGames.length : 0), 0)
        : 0;
}

// ===== Logout =====
function handleLogout() {
    adminState.currentUser = null;
    window.location.href = '/';
}

// ===== Event Listeners =====
document.getElementById('createQuizBtn').addEventListener('click', () => openQuizModal());
document.getElementById('quizForm').addEventListener('submit', handleQuizSubmit);

document.getElementById('createQuestionBtn').addEventListener('click', () => {
    if (adminState.quizzes.length === 0) {
        showToast('Please create a quiz first', 'warning');
        return;
    }
    openQuestionModal();
});
document.getElementById('questionForm').addEventListener('submit', handleQuestionSubmit);

logoutBtn.addEventListener('click', handleLogout);

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    // Simulate login
    adminState.currentUser = {
        id: 1,
        username: 'admin',
    };
    currentUserSpan.textContent = 'Admin';

    // Load quizzes by default
    switchTab('quizzes');
});
