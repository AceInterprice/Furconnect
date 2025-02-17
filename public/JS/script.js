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

///////// MASCOTAS //////////
async function fetchPets() {
    showPagination(false);
    showContainer('petsContainer');
    const token = getToken();
    try {
        const response = await fetch(`/api/pets/owner/${userID}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            if (response.status === 401) {
                alert('Sesión expirada. Inicia sesión nuevamente.');
                window.location.href = '../index.html';
                return;
            }
            const errorMsg = await response.text();
            alert(`Error: ${response.status} - ${errorMsg}`);
            return;
        }

        const pets = await response.json();
        displayUserPets(pets);
        populatePetSelector(pets);
        document.getElementById('petsContainer').style.display = 'block';
    } catch (error) {
        alert('Error al conectar con el servidor.');
    }
}

function displayUserPets(pets) {
    const petsContainer = document.getElementById('petsContainer');
    if (pets.length > 0) {
        const petList = pets.map(pet =>`
            <div class="pet-card" onclick="showPetDetails('${pet._id}', '${pet.nombre}', '${pet.raza}', '${pet.tipo}', '${pet.color}', '${pet.tamaño}', ${pet.edad}, '${pet.sexo}', ${pet.pedigree}, '${pet.temperamento}', '${pet.vacunas.join(', ')}', '${pet.media.join(', ')}', '${pet.imagen}')">
                <img src="${pet.imagen}" alt="${pet.nombre}">
                <div class="pet-content">
                    <div class="pet-header">
                        <h3>${pet.nombre}</h3>
                        <span class="sex-icon">
                            ${pet.sexo === 'macho' ? '<i class="fas fa-mars"></i>' : '<i class="fas fa-venus"></i>'}
                        </span>
                    </div>
                    <p><strong>Raza:</strong> ${pet.raza}</p>
                    <p><strong>Tipo:</strong> ${pet.tipo}</p>
                    <p><strong>Edad:</strong> ${pet.edad} años</p>
                    <p><strong>Temperamento:</strong> ${pet.temperamento}</p>
                </div>
            </div>`
        ).join('');
        
        petsContainer.innerHTML = petList;
    } else {
        petsContainer.textContent = 'No se encontraron mascotas.';
    }
}

function showPetDetails(id, nombre, raza, tipo, color, tamaño, edad, sexo, pedigree, temperamento, vacunas, media, imagen) {
    const petDetails = document.getElementById('petDetails');
    petDetails.innerHTML = `
        <div class="pet-details-card">
            <button class="close-btn" onclick="closePetDetails()">&times;</button>
            <img src="${imagen}">
            <h2>${nombre} ${pedigree ? '<i class="fas fa-medal" title="Pedigree"></i>' : ''}</h2>
            <p><strong>ID:</strong> ${id}</p>
            <p><strong>Raza:</strong> ${raza}</p>
            <p><strong>Tipo:</strong> ${tipo}</p>
            <p><strong>Color:</strong> ${color}</p>
            <p><strong>Tamaño:</strong> ${tamaño}</p>
            <p><strong>Edad:</strong> ${edad} años</p>
            <p><strong>Sexo:</strong> ${sexo}</p>
            <p><strong>Temperamento:</strong> ${temperamento}</p>
            <p><strong>Vacunas:</strong> ${vacunas}</p>
            <p><strong>Media:</strong> ${media}</p>
            <div class="button-container">
                <button class="edit-btn" onclick="editPet('${id}', '${nombre}', '${raza}', '${tipo}', '${color}', '${tamaño}', '${edad}', '${sexo}', ${pedigree}, '${temperamento}', '${vacunas}', '${media}')">Editar</button>
                <button class="delete-btn" onclick="removePet('${id}')">Eliminar</button>
            </div>
        </div>
    `;
    petDetails.style.display = 'flex'; // Mostrar el modal
}

function closePetDetails() {
    document.getElementById('petDetails').style.display = 'none';
}

function populatePetSelector(pets) {
    const selector = document.getElementById('myPetsSelector');
    selector.innerHTML = ''; // Limpiar el selector

    pets.forEach(pet => {
        const option = document.createElement('option');
        option.value = pet._id;
        option.textContent = pet.nombre; // Mostrar el nombre de la mascota
        selector.appendChild(option);
    });
}

function showAddPetForm() {
    showContainer('addPetForm'); // Muestra el formulario de agregar mascota
    showPagination(false); // Oculta la paginación porque es un formulario
}

document.getElementById("petImagen").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imagePreview = document.getElementById("imagePreview");
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('addPetForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const petId = document.getElementById('petId').value;
    const petData = {
        usuario_id: userID,
        nombre: document.getElementById('petName').value,
        raza: document.getElementById('petRaza').value,
        tipo: document.getElementById('petTipo').value,
        color: document.getElementById('petColor').value,
        tamaño: document.getElementById('petTamaño').value,
        edad: parseInt(document.getElementById('petEdad').value),
        sexo: document.getElementById('petSexo').value,
        pedigree: document.getElementById('petPedigree').checked,
        temperamento: document.getElementById('petTemperamento').value,
        vacunas: document.getElementById('petVacunas').value.split(',').map(v => v.trim()),
        media: document.getElementById('petMedia').value.split(',').map(m => m.trim())
    };

    const token = getToken();
    const url = petId ? `/api/updatepet/${petId}` : '/api/newpet';
    const method = petId ? 'PUT' : 'POST';
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(petData)
    });

    if (response.ok) {
        alert('Mascota guardada correctamente.');
        document.getElementById('addPetForm').reset();
        document.getElementById('addPetForm').style.display = 'none';
        fetchPets();
    } else {
        const errorData = await response.json();
        alert(`Error al guardar mascota: ${errorData.error}`);
    }
});

async function editPet(id, nombre, raza, tipo, color, tamaño, edad, sexo, pedigree, temperamento, vacunas, media, imagen) {
    document.getElementById('formTitle').textContent = 'Editar Mascota';
    document.getElementById('petId').value = id;
    document.getElementById('petName').value = nombre;
    document.getElementById('petRaza').value = raza;
    document.getElementById('petTipo').value = tipo;
    document.getElementById('petColor').value = color;
    document.getElementById('petTamaño').value = tamaño;
    document.getElementById('petEdad').value = edad;
    document.getElementById('petSexo').value = sexo;
    document.getElementById('petPedigree').checked = pedigree;
    document.getElementById('petTemperamento').value = temperamento;
    document.getElementById('petVacunas').value = vacunas;
    document.getElementById('petMedia').value = media;

    // Verificar si hay una imagen existente y mostrarla en la vista previa
    if (imagen) {
        const imagePreview = document.getElementById("imagePreview");
        imagePreview.src = imagen;
        imagePreview.style.display = "block";
    }

    document.getElementById('addPetForm').style.display = 'block';
}


function removePet(id) {
    const modal = document.getElementById('confirmModal');
    const confirmButton = document.getElementById('confirmDelete');
    const cancelButton = document.getElementById('cancelDelete');

    // Muestra el modal sobre los detalles de la mascota
    modal.style.display = 'flex';

    // Si el usuario cancela, oculta el modal sin cerrar los detalles
    cancelButton.onclick = () => {
        modal.style.display = 'none';
    };

    // Si el usuario confirma, procede con la eliminación
    confirmButton.onclick = async () => {
        modal.style.display = 'none';

        const token = getToken();
        try {
            const response = await fetch(`/api/pets/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Mascota eliminada exitosamente.');
                closePetDetails(); // Ahora sí cerramos los detalles después de eliminar
                fetchPets(); // Refresca la lista de mascotas
            } else {
                const errorData = await response.json();
                alert(`Error al eliminar mascota: ${errorData.error}`);
            }
        } catch (error) {
            alert('Error de conexión. Intenta nuevamente.');
        }
    };
}

////// Paginación y Busqueda ///////
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
                <h3>${pet.nombre}</h3>
                <p><strong>Raza:</strong> ${pet.raza}</p>
                <p><strong>Tipo:</strong> ${pet.tipo}</p>
                <p><strong>Color:</strong> ${pet.color}</p>
                <p><strong>Tamaño:</strong> ${pet.tamaño}</p>
                <p><strong>Edad:</strong> ${pet.edad}</p>
                <p><strong>Sexo:</strong> ${pet.sexo}</p>
                <div class="pet-actions">
                    <button onclick="sendRequest('${pet._id}', '${pet.usuario_id._id}')">Solicitar</button>
                </div>
            </div>
        `).join('');
    } else {
        container.innerHTML = `<div style="text-align: center; padding: 20px;">No se encontraron mascotas disponibles.</div>`;
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

//////// Solicitudes /////////
async function sendRequest(mascotaSolicitadaId, usuarioSolicitadoId) {
    const mascotaSolicitanteId = document.getElementById('myPetsSelector').value; // Obtener el ID de la mascota seleccionada
    const requestData = {
        usuario_solicitante_id: userID,
        mascota_solicitante_id: mascotaSolicitanteId, // ID de la mascota seleccionada
        usuario_solicitado_id: usuarioSolicitadoId, // Ajusta esto según tu lógica
        mascota_solicitado_id: mascotaSolicitadaId,
        estado: "pendiente",
        fecha_solicitud: new Date()
    };
    console.log(mascotaSolicitanteId)

    const token = getToken();
    const response = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
    });

    if (response.ok) {
        alert('Solicitud enviada correctamente.');
    } else {
        const errorData = await response.json();
        alert(`Error al enviar solicitud: ${errorData.error}`);
    }
}

async function fetchSolicitudes() {
    showPagination(false);
    showContainer('solicitudesContainer');
    const token = getToken();

    const solicitudesUrls = [
        { url: '/api/solicitudes/recibidas', displayFunction: displaySolicitudesRecibidas },
        { url: '/api/solicitudes/enviadas', displayFunction: displaySolicitudesEnviadas }
    ];

    for (const { url, displayFunction } of solicitudesUrls) {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const requests = await response.json();
            console.log(requests);
            displayFunction(requests);
        } else {
            const errorData = await response.json();
            alert(`Error al obtener solicitudes: ${errorData.error}`);
        }
    }

    document.getElementById('solicitudesContainer').style.display = 'block'; // Mostrar solicitudes
}

function displaySolicitudesRecibidas(requests) {
    displaySolicitudes(requests, '#solicitudesTable tbody', true);
}

function displaySolicitudesEnviadas(requests) {
    displaySolicitudes(requests, '#solicitudesEnviadasTable tbody', false);
}

function displaySolicitudes(requests, tableBodySelector, showActions) {
    const tableBody = document.querySelector(tableBodySelector);
    tableBody.innerHTML = ''; // Limpiar el contenido previo

    requests.forEach(request => {
        const row = document.createElement('tr');

        // Crear celdas para cada columna con valores verificados
        const mascotaSolicitanteCell = document.createElement('td');
        mascotaSolicitanteCell.textContent = request.mascota_solicitante_id?.nombre || 'N/A';

        const usuarioSolicitanteCell = document.createElement('td');
        usuarioSolicitanteCell.textContent = request.mascota_solicitante_id?.usuario_id || 'N/A';

        const mascotaSolicitadaCell = document.createElement('td');
        mascotaSolicitadaCell.textContent = request.mascota_solicitado_id?.nombre || 'N/A';

        const usuarioSolicitadoCell = document.createElement('td');
        usuarioSolicitadoCell.textContent = request.mascota_solicitado_id?.usuario_id || 'N/A';

        const estadoCell = document.createElement('td');
        estadoCell.textContent = request.estado || 'Pendiente';

        const accionesCell = document.createElement('td');
        if (showActions && request.estado === 'pendiente') {
            const aceptarBtn = document.createElement('button');
            aceptarBtn.textContent = 'Aceptar';
            aceptarBtn.classList.add('btn', 'btn-success');
            aceptarBtn.addEventListener('click', () => updateSolicitudEstado(request._id, 'aceptado'));

            const rechazarBtn = document.createElement('button');
            rechazarBtn.textContent = 'Rechazar';
            rechazarBtn.classList.add('btn', 'btn-danger');
            rechazarBtn.addEventListener('click', () => updateSolicitudEstado(request._id, 'rechazado'));

            // Añadir los botones a la celda de acciones
            accionesCell.appendChild(aceptarBtn);
            accionesCell.appendChild(rechazarBtn);
        }

        // Añadir las celdas a la fila
        row.appendChild(mascotaSolicitanteCell);
        row.appendChild(usuarioSolicitanteCell);
        row.appendChild(mascotaSolicitadaCell);
        row.appendChild(usuarioSolicitadoCell);
        row.appendChild(estadoCell);
        row.appendChild(accionesCell);

        // Añadir la fila al cuerpo de la tabla
        tableBody.appendChild(row);
    });
}


async function updateSolicitudEstado(id, nuevoEstado) {
    const token = getToken();
    const response = await fetch(`/api/solicitudes/${id}/estado`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
    });

    if (response.ok) {
        alert(`Solicitud ${nuevoEstado} correctamente.`);
        fetchSolicitudes(); // Refresca la lista de solicitudes
    } else {
        const errorData = await response.json();
        alert(`Error al actualizar solicitud: ${errorData.error}`);
    }
}

////////////////////////////ENCUENTROS/////////////////////////////
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

// Handle add/edit encounter form submission
document.getElementById('encounterForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const encounterId = document.getElementById('encounterId').value; // Obtener el ID del encuentro (si está editando)
    const encounterData = {
        mascota_id: document.getElementById('mascotaId').value,
        mascota2_id: document.getElementById('mascota2Id').value,
        fecha: new Date(document.getElementById('fecha').value),
        ubicacion: {
            ciudad: document.getElementById('ciudad').value,
            calle: document.getElementById('calle').value,
            nombre_lugar: document.getElementById('nombreLugar').value,
        },
        estado: document.getElementById('estado').value,
    };

    const token = getToken();
    const url = encounterId ? `/api/encounters/${encounterId}` : '/api/encounters'; // Determinar la URL
    const method = encounterId ? 'PUT' : 'POST'; // Determinar el método HTTP
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(encounterData)
    });

    if (response.ok) {
        alert('Encuentro guardado correctamente.');
        document.getElementById('encounterForm').reset(); // Resetear el formulario
        document.getElementById('encountersContainer').style.display = 'none'; // Ocultar lista de encuentros
        fetchEncounters(); // Refrescar la lista de encuentros
    } else {
        const errorData = await response.json();
        alert(`Error al guardar encuentro: ${errorData.error}`);
    }
});

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



function showAddEncounterForm() {
    showContainer('encounterContainer');
    document.getElementById('encounterContainer').style.display = 'block'; // Mostrar el contenedor del formulario
    document.getElementById('encounterForm').reset(); // Limpiar el formulario
    document.getElementById('encounterId').value = ''; // Asegúrate de que el campo ID esté vacío
}

document.getElementById('encounterForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const encounterId = document.getElementById('encounterId').value;
    const encounterData = {
        mascota_id: document.getElementById('mascotaId').value,
        mascota2_id: document.getElementById('mascota2Id').value,
        fecha: new Date(document.getElementById('fecha').value).toISOString(),
        ubicacion: {
            ciudad: document.getElementById('ciudad').value,
            calle: document.getElementById('calle').value,
            nombre_lugar: document.getElementById('nombreLugar').value,
        },
        estado: document.getElementById('estado').value,
    };

    const token = getToken();
    const url = encounterId ? `/api/encounters/${encounterId}` : '/api/encounters';
    const method = encounterId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(encounterData)
    });

    if (response.ok) {
        alert('Encuentro guardado correctamente.');
        fetchEncounters(); // Refrescar la lista de encuentros
        document.getElementById('encounterContainer').style.display = 'none'; // Ocultar el formulario después de guardar
    } else {
        const errorData = await response.json();
        alert(`Error al guardar encuentro: ${errorData.error}`);
    }
});

// Función para editar un encuentro
async function editEncounter(id, mascotaId, mascota2Id, fecha, ciudad, calle, nombreLugar, estado) {
    document.getElementById('encounterId').value = id;
    document.getElementById('mascotaId').value = mascotaId;
    document.getElementById('mascota2Id').value = mascota2Id;
    document.getElementById('fecha').value = new Date(fecha).toISOString().slice(0, 16); // Formato para datetime-local
    document.getElementById('ciudad').value = ciudad;
    document.getElementById('calle').value = calle;
    document.getElementById('nombreLugar').value = nombreLugar;
    document.getElementById('estado').value = estado;
    document.getElementById('encounterContainer').style.display = 'block'; // Mostrar el formulario
}

// Función para eliminar un encuentro
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

//////////////// SEGUIMIENTOS ///////////
// Función para cargar todos los seguimientos
async function fetchSeguimientos() {
    showContainer('seguimientosContainer');
    try {
        const response = await fetch('/api/seguimiento', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Error al cargar seguimientos');

        const seguimientos = await response.json();
        displaySeguimientos(seguimientos);
    } catch (error) {
        console.error(error);
        alert('Error al cargar los seguimientos. Verifica la consola para más detalles.');
    }
}

// Función para mostrar los seguimientos en la tabla
function displaySeguimientos(seguimientos) {
    const tableBody = document.getElementById('seguimientosTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla existente

    seguimientos.forEach(seguimiento => {
        const row = `
            <tr>
                <td>${seguimiento._id}</td>
                <td>${seguimiento.exitoso ? 'Sí' : 'No'}</td>
                <td>
                    <button class="btn btn-edit" onclick="editSeguimiento('${seguimiento._id}')">Editar</button>
                    <button class="btn btn-delete" onclick="deleteSeguimiento('${seguimiento._id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row; // Añadir cada fila a la tabla
    });

    // Mostrar el contenedor de la tabla
    document.getElementById('seguimientosContainer').style.display = 'block';
}


// Función para mostrar el formulario de añadir seguimiento
function showAddSeguimientoForm() {
    showContainer('seguimientoContainer');
    resetSeguimientoForm(); // Limpiar el formulario
    document.getElementById('seguimientoContainer').style.display = 'block';
}

// Función para resetear el formulario de seguimiento
function resetSeguimientoForm() {
    document.getElementById('seguimientoId').value = ''; // Vaciar el ID para añadir uno nuevo
    document.getElementById('encuentroId').value = '';
    document.getElementById('exitoso').value = 'true';
    const actualizacionesContainer = document.getElementById('actualizacionesContainer');
    actualizacionesContainer.innerHTML = '';
    addActualizacionField(); // Añadir un campo de actualización vacío por defecto
}

// Función para añadir un campo de actualización
function addActualizacionField() {
    const actualizacionesContainer = document.getElementById('actualizacionesContainer');
    const index = actualizacionesContainer.children.length;
    
    const actualizacionDiv = document.createElement('div');
    actualizacionDiv.innerHTML = `
        <h4>Actualización ${index + 1}</h4>
        <label for="asunto_${index}">Asunto:</label>
        <input type="text" id="asunto_${index}" required><br>
        <label for="descripcion_${index}">Descripción:</label>
        <input type="text" id="descripcion_${index}" required><br>
        <label>Adjuntos:</label>
        <div id="adjuntos_${index}"></div>
        <button type="button" onclick="addAdjuntoField(${index})">Agregar Adjunto</button>
        <hr>
    `;
    actualizacionesContainer.appendChild(actualizacionDiv);
}

// Función para añadir un campo de adjunto dentro de una actualización específica
function addAdjuntoField(actualizacionIndex) {
    const adjuntosContainer = document.getElementById(`adjuntos_${actualizacionIndex}`);
    const adjuntoIndex = adjuntosContainer.children.length;

    const adjuntoDiv = document.createElement('div');
    adjuntoDiv.innerHTML = `
        <label for="tipo_${actualizacionIndex}_${adjuntoIndex}">Tipo:</label>
        <input type="text" id="tipo_${actualizacionIndex}_${adjuntoIndex}" required>
        <label for="url_${actualizacionIndex}_${adjuntoIndex}">URL:</label>
        <input type="text" id="url_${actualizacionIndex}_${adjuntoIndex}" required>
        <button type="button" onclick="removeElement(this)">Eliminar Adjunto</button>
    `;
    adjuntosContainer.appendChild(adjuntoDiv);
}

// Función para manejar el envío del formulario de seguimiento
async function handleSeguimientoSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('seguimientoId').value;
    const encuentroId = document.getElementById('encuentroId').value;
    const exitoso = document.getElementById('exitoso').value === 'true';
    const actualizaciones = [];

    // Obtener las actualizaciones
    const actualizacionesContainer = document.getElementById('actualizacionesContainer');
    Array.from(actualizacionesContainer.children).forEach((actualizacionDiv, index) => {
        const asunto = document.getElementById(`asunto_${index}`).value;
        const descripcion = document.getElementById(`descripcion_${index}`).value;
        const adjuntos = [];

        // Obtener los adjuntos de cada actualización
        const adjuntosContainer = document.getElementById(`adjuntos_${index}`);
        Array.from(adjuntosContainer.children).forEach((adjuntoDiv, adjuntoIndex) => {
            const tipo = document.getElementById(`tipo_${index}_${adjuntoIndex}`).value;
            const url = document.getElementById(`url_${index}_${adjuntoIndex}`).value;
            adjuntos.push({ tipo, url });
        });

        actualizaciones.push({ asunto, descripcion, adjuntos });
    });

    const payload = { encuentro_id: encuentroId, exitoso, actualizaciones };
    console.log(JSON.stringify(payload))
    try {
        const method = id ? 'PUT' : 'POST'; // Usar PUT si se está editando
        const url = id ? `/api/seguimiento/${id}` : '/api/seguimiento';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Error al guardar el seguimiento');

        alert('Seguimiento guardado con éxito');
        fetchSeguimientos(); // Recargar seguimientos después de guardar
        document.getElementById('seguimientoContainer').style.display = 'none';
    } catch (error) {
        console.error(error);
        alert('Error al guardar el seguimiento. Verifica la consola para más detalles.');
    }
}

// Función para eliminar un elemento del DOM
function removeElement(element) {
    element.parentElement.remove();
}

// Función para editar un seguimiento (obtener datos y mostrarlos en el formulario)
async function editSeguimiento(id) {
    try {
        const response = await fetch(`/api/seguimiento/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Error al cargar seguimiento');

        const seguimiento = await response.json();
        document.getElementById('seguimientoId').value = seguimiento._id;
        document.getElementById('encuentroId').value = seguimiento.encuentro_id;
        document.getElementById('exitoso').value = seguimiento.exitoso ? 'true' : 'false';

        const actualizacionesContainer = document.getElementById('actualizacionesContainer');
        actualizacionesContainer.innerHTML = '';
        
        seguimiento.actualizaciones.forEach((actualizacion, index) => {
            addActualizacionField(); // Añadir cada actualización existente
            document.getElementById(`asunto_${index}`).value = actualizacion.asunto;
            document.getElementById(`descripcion_${index}`).value = actualizacion.descripcion;
            
            const adjuntosContainer = document.getElementById(`adjuntos_${index}`);
            actualizacion.adjuntos.forEach((adjunto, adjuntoIndex) => {
                addAdjuntoField(index);
                document.getElementById(`tipo_${index}_${adjuntoIndex}`).value = adjunto.tipo;
                document.getElementById(`url_${index}_${adjuntoIndex}`).value = adjunto.url;
            });
        });

        document.getElementById('seguimientoContainer').style.display = 'block';
    } catch (error) {
        console.error(error);
        alert('Error al cargar el seguimiento para editar. Verifica la consola para más detalles.');
    }
}

// Función para eliminar un seguimiento
async function deleteSeguimiento(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este seguimiento?')) return;

    try {
        const response = await fetch(`/api/seguimiento/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Error al eliminar el seguimiento');

        alert('Seguimiento eliminado con éxito');
        fetchSeguimientos(); // Recargar seguimientos después de eliminar
    } catch (error) {
        console.error(error);
        alert('Error al eliminar el seguimiento. Verifica la consola para más detalles.');
    }
}

function showPagination(show) {
    const paginationContainer = document.getElementById('paginationContainer');
    if (show) {
        paginationContainer.style.display = 'flex'; // Mostrar la paginación
    } else {
        paginationContainer.style.display = 'none'; // Ocultar la paginación
    }
}

/////////PUBLICACIONES///////
const fetchPublications = async () => {
    try {
      const response = await fetch('/api/publications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const publications = await response.json();
        renderPublications(publications);
      } else {
        console.error('Error al obtener las publicaciones');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };
  
  const renderPublications = (publications) => {
    const publicationContainer = document.getElementById('publication-list');
    publicationContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas publicaciones
  
    publications.forEach((publication) => {
      const mascota = publication.mascota_id;   // Acceso a los datos de la mascota
      const usuario = publication.usuario_id;   // Acceso a los datos del usuario
  
      const publicationElement = document.createElement('div');
      publicationElement.classList.add('publication');
  
      publicationElement.innerHTML = ` 
        <h3>${publication.title}</h3>
        <p><strong>Etiqueta:</strong> ${publication.etiqueta}</p>
        <p>${publication.description}</p>
        
        <p><strong>Raza:</strong> ${mascota ? mascota.raza : 'No especificado'}</p>
        <p><strong>Vacunas:</strong> ${mascota && mascota.vacunas ? mascota.vacunas.join(', ') : 'No registradas'}</p>
        <p><strong>Sexo:</strong> ${mascota ? mascota.sexo : 'No especificado'}</p>
        <p><strong>Temperamento:</strong> ${mascota && mascota.temperamento ? mascota.temperamento : 'No especificado'}</p>
        <p><strong>Pedigrí:</strong> ${mascota && mascota.pedigree ? 'Sí' : 'No'}</p>
  
        <p><strong>Contacto:</strong> ${usuario ? usuario.telefono : 'Sin número registrado'}</p>
        <p><strong>Ciudad:</strong> ${publication.ciudad}</p>
        <p><strong>Estado:</strong> ${publication.estado}</p>
        <p><strong>País:</strong> ${publication.pais}</p>
        <p><strong>Fecha de publicación:</strong> ${new Date(publication.fecha_publicacion).toLocaleDateString()}</p>
        <p><strong>Estado de publicación:</strong> ${publication.estado_publicacion}</p>
  
        <button onclick="editPublication('${publication._id}')">Editar</button>
        <button onclick="deletePublication('${publication._id}')">Eliminar</button>
      `;
      publicationContainer.appendChild(publicationElement);
    });
  };



    

