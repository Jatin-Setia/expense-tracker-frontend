const API_BASE = 'https://expense-tracker-ejph.onrender.com/api/auth';
const authError = document.getElementById('authError');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authError.textContent = '';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                authError.textContent = data.error;
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.name);
            window.location.href = 'index.html';
        } catch (err) {
            authError.textContent = 'Could not connect to the server.';
        }
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authError.textContent = '';

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_BASE}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                authError.textContent = data.error;
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.name);
            window.location.href = 'index.html';
        } catch (err) {
            authError.textContent = 'Could not connect to the server.';
        }
    });
}