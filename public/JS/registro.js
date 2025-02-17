// Esperar a que el DOM cargue antes de asignar eventos
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", async function(event) {
        event.preventDefault(); // Evita que la página se recargue

        const userName = document.getElementById("userName").value.trim();
        const userLastName = document.getElementById("userLastName").value.trim();
        const userEmail = document.getElementById("userEmail").value.trim();
        const userPassword = document.getElementById("userPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const userPhone = document.getElementById("userPhone").value.trim();
        const userCity = document.getElementById("userCity").value.trim();
        const userState = document.getElementById("userState").value.trim();
        const userCountry = document.getElementById("userCountry").value.trim();
        const termsAccepted = document.getElementById("terms").checked;

        const messageElement = document.getElementById("message");
        if (messageElement) messageElement.textContent = ""; // Limpiar mensaje previo

        // Validaciones básicas
        if (!userName || !userLastName || !userEmail || !userPassword || !userState || !userCountry) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        // Validar la seguridad de la contraseña
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(userPassword)) {
            alert("La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.");
            return;
        }

        // Validar que las contraseñas coincidan
        if (userPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        if (!termsAccepted) {
            alert("Debes aceptar los términos y condiciones.");
            return;
        }

        // Objeto usuario
        const newUser = {
            nombre: userName,
            apellido: userLastName,
            email: userEmail,
            password: userPassword,
            telefono: userPhone,
            ciudad: userCity,
            estado: userState,
            pais: userCountry
        };

        try {
            const response = await fetch('/api/users', { // Cambia la URL si es necesario
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error en el registro");
            }

            alert("Registro exitoso. Redirigiendo a la página de inicio...");
            window.location.href = "../index.html"; // Redirigir a inicio de sesión

        } catch (error) {
            alert("Error en el registro: " + error.message);
        }
    });
});
