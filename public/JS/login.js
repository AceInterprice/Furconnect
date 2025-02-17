document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) {
        console.error("Formulario de inicio de sesión no encontrado.");
        return;
    }

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita el envío del formulario

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userID', data.user.id);
                localStorage.setItem('role', data.user.role);

                // Redirección según el rol del usuario
                const redirectURL = data.user.role === 'admin' ? "./content/admin.html" : "./content/consultas.html";
                window.location.href = redirectURL;
            } else {
                alert("Error: " + (data.message || "Credenciales incorrectas."));
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Error en la conexión con el servidor.");
        }
    });
});
