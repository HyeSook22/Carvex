// Manejo del formulario de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Validación básica
    if (username.trim() === '' || password.trim() === '') {
        showMessage('Por favor, completa todos los campos', 'error');
        return;
    }

    // Obtener usuarios registrados
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    // Verificar credenciales
    if (users[username] && users[username] === password) {
        // Login exitoso
        const sessionData = {
            username: username,
            loginTime: new Date().toISOString(),
            remember: remember
        };

        if (remember) {
            localStorage.setItem('session', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('session', JSON.stringify(sessionData));
        }

        showMessage('Inicio de sesión exitoso!', 'success');

        // Redireccionar al dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showMessage('Usuario o contraseña incorrectos', 'error');
    }
});

// Manejo del botón de registro
document.getElementById('registerBtn').addEventListener('click', function() {
    const username = prompt('Ingresa un nombre de usuario:');
    if (!username || username.trim() === '') {
        showMessage('Nombre de usuario inválido', 'error');
        return;
    }

    const password = prompt('Ingresa una contraseña:');
    if (!password || password.trim() === '') {
        showMessage('Contraseña inválida', 'error');
        return;
    }

    const confirmPassword = prompt('Confirma tu contraseña:');
    if (password !== confirmPassword) {
        showMessage('Las contraseñas no coinciden', 'error');
        return;
    }

    // Guardar usuario
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[username]) {
        showMessage('El usuario ya existe', 'error');
        return;
    }

    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));

    showMessage('Usuario registrado exitosamente! Ahora puedes iniciar sesión', 'success');

    // Auto-rellenar el formulario
    document.getElementById('username').value = username;
});

// Función para mostrar mensajes
function showMessage(message, type) {
    // Remover mensaje anterior si existe
    const existingMsg = document.querySelector('.message');
    if (existingMsg) {
        existingMsg.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Estilos del mensaje
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 30px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        ${type === 'success'
            ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'
            : 'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);'}
    `;

    document.body.appendChild(messageDiv);

    // Remover después de 3 segundos
    setTimeout(() => {
        messageDiv.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Animaciones CSS para mensajes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Verificar si ya hay sesión activa
window.addEventListener('load', function() {
    const session = localStorage.getItem('session') || sessionStorage.getItem('session');
    if (session) {
        const sessionData = JSON.parse(session);
        // Verificar si la sesión es válida (menos de 24 horas)
        const loginTime = new Date(sessionData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
            window.location.href = 'dashboard.html';
        } else {
            // Sesión expirada
            localStorage.removeItem('session');
            sessionStorage.removeItem('session');
        }
    }
});
