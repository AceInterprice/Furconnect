document.addEventListener("DOMContentLoaded", async () => {
    const userID = localStorage.getItem("userID");
    const token = getToken();
    let chartInstances = {}; // Guardar instancias de gráficos para evitar duplicados

    if (!userID || !token) {
        alert("No tienes permisos para acceder a esta página.");
        window.location.href = "../index.html"; // Redirigir al login si no hay sesión
        return;
    }

    // Ocultar todas las secciones por defecto
    document.querySelectorAll(".chart-box, .card").forEach(el => el.style.display = "none");

    // Agregar eventos a la barra lateral para cambiar de sección
    document.querySelectorAll(".sidebar nav ul li a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            let targetId = link.getAttribute("href").substring(1);

            document.querySelectorAll(".chart-box, .card").forEach(el => {
                el.style.display = "none"; // Ocultar todas las secciones
            });

            document.getElementById(targetId).style.display = "block"; // Mostrar solo la seleccionada
        });
    });

    async function fetchData(url) {
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Error al obtener los datos");
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Función para actualizar gráficos sin acumulaciones
    function renderChart(canvasId, title, labels, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");

        // Destruir gráfico previo si existe
        if (chartInstances[canvasId]) {
            chartInstances[canvasId].destroy();
        }

        // Crear nuevo gráfico y guardarlo en el registro
        chartInstances[canvasId] = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    backgroundColor: ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6"],
                    borderColor: "#fff",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // Evitar crecimiento descontrolado
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: Math.max(...data) * 1.2, // Ajuste dinámico
                        ticks: {
                            callback: function (value) {
                                return Number.isInteger(value) ? value : null;
                            }
                        }
                    }
                }
            }
        });
    }

    // Obtener y mostrar la cantidad de usuarios activos
    const usuariosActivosData = await fetchData("/api/admin/usuarios-activos");
    if (usuariosActivosData) {
        document.getElementById("usuariosActivosCount").textContent = usuariosActivosData.usuariosActivos;
    }

    // Obtener y mostrar datos de usuarios por plan
    const usuariosPlanData = await fetchData("/api/admin/usuarios-plan");
    if (usuariosPlanData) {
        const labels = usuariosPlanData.map(item => item._id);
        const data = usuariosPlanData.map(item => item.cantidad);
        renderChart("usuariosPlanChart", "Usuarios por Plan", labels, data);
    }

    // Obtener y mostrar datos de razas populares
    const razasPopularesData = await fetchData("/api/admin/razas-populares");
    if (razasPopularesData) {
        const labels = razasPopularesData.map(item => item._id);
        const data = razasPopularesData.map(item => item.cantidad);
        renderChart("razasPopularesChart", "Razas Populares", labels, data);
    }

    // Obtener y mostrar datos de solicitudes por estado
    const solicitudesEstadoData = await fetchData("/api/admin/solicitudes-estado");
    if (solicitudesEstadoData) {
        const labels = solicitudesEstadoData.map(item => item._id);
        const data = solicitudesEstadoData.map(item => item.total);
        renderChart("solicitudesEstadoChart", "Solicitudes por Estado", labels, data);
    }
});

// Función para obtener el token desde localStorage
function getToken() {
    return localStorage.getItem("token");
}

function logout() {
    localStorage.removeItem('userID');
    localStorage.removeItem('token');
    window.location.href = "../index.html";
}
