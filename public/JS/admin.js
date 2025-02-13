const userID = localStorage.getItem('userID');
function getToken() { return localStorage.getItem('token'); }

function showContainer(containerId) {
    // Selecciona todos los contenedores con la clase 'content-container'
    const containers = document.querySelectorAll('.content-container');

    // Oculta todos los contenedores
    containers.forEach(container => {
        container.style.display = 'none';
    });

    // Muestra el contenedor especificado
    const containerToShow = document.getElementById(containerId);
    if (containerToShow) {
        containerToShow.style.display = 'block';
    } else {
        console.warn(`El contenedor con ID "${containerId}" no existe.`);
    }
}
////////// MASCOTAS //////////
let currentPage = 1; 
const limitPerPage = 20; 

// Función para obtener todas las mascotas con paginación
async function fetchAllPets(page = 1, limit = limitPerPage) {
    currentPage = page;
    showContainer('requestContainer');
    const token = getToken();
    
    const url = `/api/pets?page=${page}&limit=${limit}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('Sesión expirada. Inicia sesión nuevamente.');
                window.location.href = './index.html';
                return;
            }
            const errorMsg = await response.text();
            alert(`Error: ${response.status} - ${errorMsg}`);
            return;
        }

        const data = await response.json();
        displayAllPets(data.pets);
        renderPagination(data.total, limit, currentPage, fetchAllPets);
    } catch (error) {
        alert(`Error al conectar con el servidor.`);
    }
}

// Función para buscar mascotas con la barra de búsqueda
async function fetchPetsSearch(page = 1, limit = limitPerPage) {
    const searchQuery = document.getElementById('searchInput').value.trim();
    if (!searchQuery) {
        fetchAllPets(1, limitPerPage); // Si está vacío, vuelve a la lista original
        return;
    }

    currentPage = page;
    showContainer('requestContainer'); 
    const token = getToken();
    
    const url = `/api/pets/search?page=${page}&limit=${limit}&query=${encodeURIComponent(searchQuery)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            alert(`Error: ${response.status}`);
            return;
        }

        const data = await response.json();
        displayAllPets(data.pets);
        renderPagination(data.total, limit, currentPage, fetchPetsSearch);
    } catch (error) {
        alert(`Error al conectar con el servidor.`);
    }
}

// Función para mostrar mascotas en pantalla
function displayAllPets(pets) {
    const container = document.getElementById('allPetsTable');
    container.innerHTML = ''; 
    if (pets.length > 0) {
        container.innerHTML = pets.map(pet => `
            <div class="pet-card">
                <h3><strong>ID </strong>:${pet._id}</h3>
                <h3>${pet.nombre}</h3>
                <p><strong>Raza:</strong> ${pet.raza}</p>
                <p><strong>Tipo:</strong> ${pet.tipo}</p>
                <p><strong>Color:</strong> ${pet.color}</p>
                <p><strong>Tamaño:</strong> ${pet.tamaño}</p>
                <p><strong>Edad:</strong> ${pet.edad}</p>
                <p><strong>Sexo:</strong> ${pet.sexo}</p>
                <div class="pet-actions">
                    <button onclick="sendRequest('${pet._id}', '${pet.usuario_id._id}')">Ver</button>
                    <button onclick="removePet('${pet._id}')">Eliminar</button>
                </div>
            </div>
        `).join('');
    } else {
        container.innerHTML = `<div style="text-align: center; padding: 20px;">No se encontraron mascotas disponibles.</div>`;
    }
}

async function removePet(id) {
    const token = getToken();
    const response = await fetch(`/api/pets/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        alert('Mascota eliminada exitosamente.');
        fetchPets(); // Refrescar la lista de mascotas
    } else {
        const errorData = await response.json();
        alert(`Error al eliminar mascota: ${errorData.error}`);
    }
}

// Función de paginación
function renderPagination(totalItems, limit, currentPage, callback) {
    const totalPages = Math.ceil(totalItems / limit);
    const paginationContainer = document.getElementById('paginationContainer');

    paginationContainer.innerHTML = '';
    paginationContainer.style.display = totalPages > 1 ? 'flex' : 'none';

    if (totalPages > 1) {
        const visibleRange = 5;
        let startPage = Math.max(1, currentPage - Math.floor(visibleRange / 2));
        let endPage = Math.min(totalPages, currentPage + Math.floor(visibleRange / 2));

        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.innerHTML += `
                <a href="#" class="${i === currentPage ? 'active' : ''}" onclick="${callback.name}(${i}, ${limit})">${i}</a>
            `;
        }
    }
}

// Detectar cambios en la barra de búsqueda
document.getElementById('searchInput').addEventListener('input', () => {
    fetchPetsSearch();
});

////////// SOLICITUDES //////////



////////// ENCUENTROS //////////
function displayEncounters(encounters) {
    const encountersContainer = document.getElementById('encountersContainer'); // Contenedor donde se agregarán las tarjetas

    encounters.forEach(encounter => {
        const encounterCard = `
            <div class="encounter-card">
                <h3>Encuentro ID: ${encounter._id}</h3>
                <p><strong>Mascota 1 ID:</strong> ${encounter.mascota_id}</p>
                <p><strong>Mascota 2 ID:</strong> ${encounter.mascota2_id}</p>
                <p><strong>Fecha:</strong> ${new Date(encounter.fecha).toLocaleString()}</p>
                <p><strong>Ubicación:</strong> ${encounter.ubicacion.ciudad}, ${encounter.ubicacion.calle}, ${encounter.ubicacion.nombre_lugar}</p>
                <p><strong>Estado:</strong> ${encounter.estado}</p>
                <div class="encounter-actions">
                    <button onclick="editEncounter('${encounter._id}', '${encounter.mascota_id}', '${encounter.mascota2_id}', '${encounter.fecha}', '${encounter.ubicacion.ciudad}', '${encounter.ubicacion.calle}', '${encounter.ubicacion.nombre_lugar}', '${encounter.estado}')">Editar</button>
                    <button onclick="removeEncounter('${encounter._id}')">Eliminar</button>
                </div>
            </div>
        `;
        encountersContainer.innerHTML += encounterCard; // Añadir la tarjeta al contenedor
    });
}

// Fetch encounters
async function fetchEncounters() {
    showContainer('encountersContainer');
    const token = getToken(); // Obtener el token de autenticación
    const response = await fetch('/api/encounters', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        const encounters = await response.json();
        displayEncounters(encounters);
        document.getElementById('encountersContainer').style.display = 'block'; // Mostrar la lista de encuentros
    } else {
        const errorData = await response.json();
        alert(`Error al obtener encuentros: ${errorData.error}`);
    }
}

// Edit encounter
async function editEncounter(id, mascota1, mascota2, fecha, ciudad, calle, nombreLugar, estado) {
    document.getElementById('encounterId').value = id;
    document.getElementById('mascotaId').value = mascota1;
    document.getElementById('mascota2Id').value = mascota2;
    document.getElementById('fecha').value = new Date(fecha).toISOString().slice(0, 16); // Formato para input datetime-local
    document.getElementById('ciudad').value = ciudad;
    document.getElementById('calle').value = calle;
    document.getElementById('nombreLugar').value = nombreLugar;
    document.getElementById('estado').value = estado;
    document.getElementById('encounterContainer').style.display = 'block'; // Mostrar formulario de edición
}

// Remove encounter
async function removeEncounter(id) {
    const token = getToken();
    const response = await fetch(`/api/encounters/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        alert('Encuentro eliminado exitosamente.');
        fetchEncounters(); // Refrescar la lista de encuentros
    } else {
        const errorData = await response.json();
        alert(`Error al eliminar encuentro: ${errorData.error}`);
    }
}
////////// SEGUIMIENTO //////////



////////// CHATS //////////
