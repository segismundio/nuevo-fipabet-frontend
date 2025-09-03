// URL de tu API. CÁMBIALA cuando lo subas a un hosting.
const API_URL = 'www.fipabet.gamer.gd/api.php';

// Referencias a elementos del DOM
const appContent = document.getElementById('app-content');
const navHome = document.getElementById('nav-home');
const navLogin = document.getElementById('nav-login');
const navRegister = document.getElementById('nav-register');
const navDashboard = document.getElementById('nav-dashboard');
const navLogout = document.getElementById('nav-logout');

// Funciones para renderizar las vistas
const renderHome = () => {
    appContent.innerHTML = `
        <h2>¡Bienvenido a FIPABET!</h2>
        <p>Para que tu vida no sea una carga</p>
        <a href="#" id="btn-register" class="button">Regístrate picha</a>
        <a href="#" id="btn-login" class="button">Ya tengo una cuenta cojone</a>
    `;
    document.getElementById('btn-register').onclick = () => renderRegister();
    document.getElementById('btn-login').onclick = () => renderLogin();
};

const renderLogin = () => {
    appContent.innerHTML = `
        <h2>Iniciar Sesión</h2>
        <form id="login-form">
            <label for="username">Usuario:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Entrar</button>
        </form>
        <p id="message"></p>
    `;
    document.getElementById('login-form').onsubmit = handleLogin;
};

const renderRegister = () => {
    appContent.innerHTML = `
        <h2>Registrarse</h2>
        <form id="register-form">
            <label for="username">Usuario:</label>
            <input type="text" id="username" name="username" required>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Registrarse</button>
        </form>
        <p id="message"></p>
    `;
    document.getElementById('register-form').onsubmit = handleRegister;
};

const renderDashboard = async () => {
    const response = await fetch(`${API_URL}?action=get_dashboard_data`);
    const data = await response.json();
    
    if (data.status === 'success') {
        const user = data.user;
        let questionsHtml = data.questions.map(q => `
            <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
                <h3>${q.texto_pregunta}</h3>
                <form class="bet-form" data-question-id="${q.id_pregunta}">
                    <input type="radio" name="id_opcion_${q.id_pregunta}" value="${q.id_opcion}" required>
                    ${q.texto_opcion} (Coste: ${q.coste} | x${q.multiplicador})
                    <br><br>
                    <label>Coins a apostar:</label>
                    <input type="number" name="coins_apostados" min="1" required>
                    <button type="submit">Apostar</button>
                </form>
            </div>
        `).join('');
        
        appContent.innerHTML = `
            <h2>Bienvenido ${user.username} (Saldo: ${user.coins} coins)</h2>
            ${questionsHtml}
            <p id="message"></p>
        `;

        document.querySelectorAll('.bet-form').forEach(form => {
            form.onsubmit = handlePlaceBet;
        });

    } else {
        appContent.innerHTML = `<p>${data.message}</p>`;
    }
};

// Funciones para manejar las acciones (login, register, etc.)
const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(`${API_URL}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    document.getElementById('message').innerText = result.message;

    if (result.status === 'success') {
        localStorage.setItem('user_id', result.data.user_id);
        localStorage.setItem('username', result.data.username);
        updateNav();
        renderDashboard();
    }
};

const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(`${API_URL}?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    document.getElementById('message').innerText = result.message;
    if (result.status === 'success') {
        setTimeout(() => renderLogin(), 2000);
    }
};

const handlePlaceBet = async (e) => {
    e.preventDefault();
    const form = e.target;
    const questionId = form.getAttribute('data-question-id');
    const coinsApostados = form.querySelector('input[name="coins_apostados"]').value;
    const idOpcion = form.querySelector(`input[name="id_opcion_${questionId}"]:checked`).value;

    const data = {
        id_pregunta: questionId,
        id_opcion: idOpcion,
        coins_apostados: coinsApostados
    };

    const response = await fetch(`${API_URL}?action=place_bet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    
    // Aquí puedes mostrar un mensaje de éxito o error
    alert(result.message);
    if (result.status === 'success') {
        renderDashboard(); // Recarga los datos del dashboard
    }
};

const updateNav = () => {
    if (localStorage.getItem('user_id')) {
        navHome.style.display = 'none';
        navLogin.style.display = 'none';
        navRegister.style.display = 'none';
        navDashboard.style.display = 'inline';
        navLogout.style.display = 'inline';
    } else {
        navHome.style.display = 'inline';
        navLogin.style.display = 'inline';
        navRegister.style.display = 'inline';
        navDashboard.style.display = 'none';
        navLogout.style.display = 'none';
    }
};

const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    updateNav();
    renderHome();
};

// Event listeners para la navegación
navHome.onclick = () => renderHome();
navLogin.onclick = () => renderLogin();
navRegister.onclick = () => renderRegister();
navDashboard.onclick = () => renderDashboard();
navLogout.onclick = () => handleLogout();

// Carga inicial
updateNav();
if (localStorage.getItem('user_id')) {
    renderDashboard();
} else {
    renderHome();

}

