function getToken() {
    return localStorage.getItem("token");
}

function getUserIdFromStorage() {
    return localStorage.getItem("userID");
}

document.addEventListener("DOMContentLoaded", async () => {
    if (!getUserIdFromStorage() || !getToken()) {
        window.location.href = "../index.html"; // Redirigir automáticamente si no hay sesión
        return;
    }
    await loadUserProfile();
});

async function loadUserProfile() {
    const userID = getUserIdFromStorage();
    const token = getToken();
    
    if (!userID || !token) {
        alert("No se pudo obtener la información del usuario.");
        return;
    }

    try {
        const response = await fetch(`/api/users/${userID}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Error al cargar el perfil");

        const user = await response.json();
        
        document.getElementById("userName").value = user.nombre;
        document.getElementById("userEmail").value = user.email;
        document.getElementById("userPhone").value = user.telefono || "";
        document.getElementById("userCountry").value = user.pais || "";
        document.getElementById("userState").value = user.estado || "";
        document.getElementById("userCity").value = user.ciudad || "";

        if (user.imagen) {
            document.getElementById("profileImage").src = user.imagen;
        }
    } catch (error) {
        alert(error.message);
    }
}

document.getElementById("editProfile").addEventListener("click", async function () {
    const userID = getUserIdFromStorage();
    const token = getToken();

    if (!userID || !token) {
        alert("No se pudo obtener la información del usuario.");
        return;
    }

    const userData = {
        imagen: document.getElementById("profileImage").value,
        nombre: document.getElementById("userName").value,
        email: document.getElementById("userEmail").value,
        telefono: document.getElementById("userPhone").value,
        pais: document.getElementById("userCountry").value,
        estado: document.getElementById("userState").value,
        ciudad: document.getElementById("userCity").value
    };

    try {
        const response = await fetch(`/api/users/${userID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            let errorMsg = "Error al actualizar el usuario";
            try {
                const errorData = await response.json();
                errorMsg = errorData.error || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        alert("Perfil actualizado correctamente.");
    } catch (error) {
        alert(error.message);
    }
});

// Cargar imagen de perfil y previsualizarla
document.getElementById("imageUpload").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("profileImage").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Eliminar perfil
document.getElementById("deleteProfile").addEventListener("click", async function () {
    const userID = getUserIdFromStorage();
    const token = getToken();

    if (!userID || !token) {
        alert("No se pudo obtener la información del usuario.");
        return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.")) {
        return;
    }

    try {
        const response = await fetch(`/api/users/${userID}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            let errorMsg = "Error al eliminar el usuario";
            try {
                const errorData = await response.json();
                errorMsg = errorData.error || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        alert("Cuenta eliminada correctamente.");
        localStorage.clear(); // Borrar datos del usuario
        window.location.href = "../index.html"; // Redirigir al login
    } catch (error) {
        alert(error.message);
    }
});

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");

    setTimeout(() => {
        window.location.href = "../index.html";
    }, 100); // Agrega un pequeño retraso
}

document.getElementById("logoutButton").addEventListener("click", logout);

