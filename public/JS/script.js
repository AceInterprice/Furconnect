const userID = localStorage.getItem('userID');
function getToken() { return localStorage.getItem('token'); }

function showContainer(containerId) {
    const containers = document.querySelectorAll('.content-container');

    containers.forEach(container => {
        container.style.display = 'none';
    });

    const containerToShow = document.getElementById(containerId);
    if (containerToShow) {
        containerToShow.style.removeProperty('display'); 
    } else {    
        console.warn(`El contenedor con ID "${containerId}" no existe.`);
    }
}

///////// MIS MASCOTAS //////////
async function fetchPets() {
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
        document.getElementById('petsContainer').style.display = 'grid';
    } catch (error) {
        alert('Error al conectar con el servidor.');
    }
}

function displayUserPets(pets) {
    const petsContainer = document.getElementById('petsContainer');
    if (pets.length > 0) {
        const petList = pets.map(pet => `
            <div class="pet-card" onclick="showPetDetails('${pet._id}', '${pet.nombre}', '${pet.raza}', '${pet.tipo}', '${pet.color}', '${pet.tamaño}', ${pet.edad}, '${pet.sexo}', ${pet.pedigree}, '${pet.temperamento}', '${pet.vacunas.join(', ')}', '${pet.media.join(', ')}', '${pet.imagen || 'default-image.png'}')">
                <img src="${pet.imagen || '../image/perro_img.png'}" alt="${pet.nombre}">
                <div class="pet-content">
                    <div class="pet-header">
                        <h3>${pet.nombre}</h3>
                        <span class="sex-icon">
                            ${pet.sexo === 'macho' ? '<i class="fas fa-mars"></i>' : '<i class="fas fa-venus"></i>'}
                        </span>
                    </div>
                    <p><strong>Raza:</strong> ${pet.raza}</p>
                    <p><strong>Tipo:</strong> ${pet.tipo}</p>
                    <p><strong>Temperamento:</strong> ${pet.temperamento}</p>
                    <p><strong>Edad:</strong> ${pet.edad} años</p>
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
        <div class="pet-details-card new-style">
            <button class="close-btn" onclick="closePetDetails()">&times;</button>
            <div class="pet-info-container">
                <img class="pet-image" src="${imagen || '../image/perro_img.png'}" alt="${nombre}">
                <div class="pet-info">
                    <h2 class="pet-name">${nombre} 
                        ${pedigree ? '<i class="fas fa-medal gold-medal" title="Pedigree"></i>' : ''}
                    </h2>
                    <p><strong>Raza:</strong> ${raza}</p>
                    <p><strong>Tipo:</strong> ${tipo}</p>
                    <p><strong>Color:</strong> ${color}</p>
                    <p><strong>Tamaño:</strong> ${tamaño}</p>
                    <p><strong>Edad:</strong> ${edad} años</p>
                    <p><strong>Sexo:</strong> ${sexo}</p>
                    <p><strong>Temperamento:</strong> ${temperamento}</p>
                    <p><strong>Vacunas:</strong> ${vacunas}</p>

                    <div class="button-container">
                        <button class="edit-btn" onclick="editPet('${id}', '${nombre}', '${raza}','${tipo}', '${color}', '${tamaño}', '${edad}', '${sexo}', ${pedigree}, '${temperamento}', '${vacunas}', '${media}', '${imagen || ''}')">Editar</button>
                        <button class="delete-btn" onclick="removePet('${id}')">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    petDetails.style.display = 'flex';
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

async function getSignedURL() {
    try {
        const token = getToken(); // Suponiendo que tienes una función para obtener el token
        const response = await fetch('/api/cloudinary-signature', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener la firma');
        }

        const data = await response.json();
        return data; // { signature, timestamp, apiKey, cloudName }
    } catch (error) {
        console.error('Error obteniendo la firma:', error);
        return null;
    }
}

async function uploadImageToCloudinary(file) {
    try {
        // 1️⃣ Obtener la firma desde el backend
        const response = await fetch('/api/cloudinary-signature', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,  // Asegurar que el token se envía
                'Content-Type': 'application/json'
            }
        });        
        const { signature, timestamp, api_key, cloudName } = await response.json();

        // 2️⃣ Preparar los datos para la subida
        const formData = new FormData();
        formData.append('file', file);
        formData.append('timestamp', timestamp);
        formData.append('api_key', api_key);
        formData.append('signature', signature);

        // 3️⃣ Subir la imagen a Cloudinary
        const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await uploadResponse.json();
        return data.secure_url; // 🔗 Retorna la URL de la imagen subida

    } catch (error) {
        console.error("Error al subir la imagen:", error);
        return null;
    }
}

function showAddPetForm() {
    document.getElementById('addPetForm').style.display = 'flex';
    document.getElementById('petsContainer').style.display = 'none'; // Oculta otras secciones si es necesario
}

// 📌 Evento para manejar el formulario de agregar mascota
document.getElementById('addPetForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const petId = document.getElementById('petId').value;
    const fileInput = document.getElementById('petImagen');
    const file = fileInput.files[0]; // Obtener la imagen seleccionada
    let imageUrl = "";

    if (file) {
        imageUrl = await uploadImageToCloudinary(file);
        if (!imageUrl) {
            alert("Error al subir la imagen.");
            return;
        }
    }

    // 📌 Crear objeto JSON con los datos de la mascota
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
        vacunas: document.getElementById('petVacunas').value.split(','), // Convertir a array
        media: document.getElementById('petMedia').value.split(','), // Convertir a array
        imagen: imageUrl // Guardar la URL en lugar del archivo
    };

    const token = getToken();
    const url = petId ? `/api/pets/${petId}` : '/api/pets';
    const method = petId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(petData) // Enviar JSON en el cuerpo
        });

        let responseData;
        try {
            responseData = await response.json();
        } catch (jsonError) {
            console.error("Error al convertir respuesta en JSON:", jsonError);
            responseData = null;
        }

        if (!response.ok) {
            throw new Error(responseData?.error || 'Error desconocido al guardar la mascota');
        }

        alert('Mascota guardada correctamente.');

        // 🧹 Limpiar el formulario
        document.getElementById('addPetForm').reset();
        document.getElementById('imagePreview').src = '';
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('addPetForm').style.display = 'none';

        await fetchPets();

    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert(`Error: ${error.message || 'No se pudo conectar con el servidor.'}`);
    }
});

// 📌 Previsualización de imagen antes de enviarla
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

async function editPet(id, nombre, raza, tipo, color, tamaño, edad, sexo, pedigree, temperamento, vacunas, media, imagen) {
    document.getElementById('editPetId').value = id;

    document.getElementById('editPetName').value = nombre;
    document.getElementById('editPetRaza').value = raza;
    document.getElementById('editPetTipo').value = tipo;
    document.getElementById('editPetColor').value = color;
    document.getElementById('editPetSexo').value = sexo;
    document.getElementById('editPetPedigree').checked = pedigree;
    document.getElementById('editPetTamaño').value = tamaño;
    document.getElementById('editPetEdad').value = edad;
    document.getElementById('editPetTemperamento').value = temperamento;
    document.getElementById('editPetVacunas').value = vacunas;
    document.getElementById('editPetMedia').value = media; 

    // 📌 Previsualizar la imagen actual
    const imagePreview = document.getElementById("editImagePreview");
    imagePreview.src = imagen || '../image/perro_img.png';
    imagePreview.style.display = "block";

    // 📌 Guardar imagen original en dataset
    const imageInput = document.getElementById('editPetImagen');
    imageInput.dataset.originalImage = imagen || '';

    // 📌 Manejar la previsualización cuando el usuario cambie la imagen
    imageInput.addEventListener("change", async function(event) {
        const file = event.target.files[0];

        if (file) {
            const newImageUrl = await uploadImageToCloudinary(file); // Subir imagen nueva
            if (newImageUrl) {
                imagePreview.src = newImageUrl; // Actualizar vista previa
                imageInput.dataset.originalImage = newImageUrl; // Guardar nueva URL en dataset
            }
        } else {
            imagePreview.src = imageInput.dataset.originalImage || 'default-image.png';
        }
    });

    document.getElementById("editFormSubmitButton").textContent = "Guardar cambios";
    document.getElementById('editPetFormContainer').style.display = 'block';
    document.getElementById("closeEditForm").style.display = "block";
}

// Función para cerrar el formulario
document.getElementById("closeEditForm").addEventListener("click", function () {
    document.getElementById("editPetFormContainer").style.display = "none";
});

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

    document.getElementById('solicitudesContainer').style.display = 'block'; 
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




    

