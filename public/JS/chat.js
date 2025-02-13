// Inicializar el socket
const socket = io();

// Verificar conexión
socket.on("connect", () => {
    console.log("Conectado al servidor Socket.io con id:", socket.id);
});

// Función para entrar a una sala de chat específica
function enterChatroom(chatroomId) {
    const chatroomIdSpan = document.getElementById("chatroom-id");
    const messagesDiv = document.getElementById("messages");
    const messageInput = document.getElementById("message-input");
    const sendMessageButton = document.getElementById("send-message");
    const userId = localStorage.getItem('userID');

    // Actualizar la interfaz
    chatroomIdSpan.textContent = chatroomId;
    showContainer('chatroom-details');
    messagesDiv.innerHTML = ''; // Limpiar mensajes previos

    // Unirse a la sala de chat
    socket.emit("joinRoom", chatroomId);
    console.log(`Cliente unido a la sala: ${chatroomId}`);

    // Escuchar mensajes nuevos
    socket.on("receiveMessage", (message) => {
        const msgDiv = document.createElement("div");
        msgDiv.textContent = `${message.senderName}: ${message.content}`;
        messagesDiv.appendChild(msgDiv);
    });

    // Escuchar los mensajes al unirse
    socket.emit("loadMessages", chatroomId);
    socket.on("loadMessages", (messages) => {
        messages.forEach((message) => {
            const msgDiv = document.createElement("div");
            msgDiv.textContent = `${message.senderName}: ${message.content}`;
            messagesDiv.appendChild(msgDiv);
        });
    });

    // Enviar mensajes
    sendMessageButton.onclick = () => {
        const messageContent = messageInput.value;
        if (messageContent.trim()) {
            socket.emit("sendMessage", {
                chatRoomId: chatroomId,
                sender: userId,
                content: messageContent,
            });
            messageInput.value = ''; // Limpiar el campo de entrada
        }
    };
}

// Función para mostrar las salas de chat
async function showChat() {
    showPagination(false);
    showContainer('chatrooms-list');
    const chatroomsList = document.getElementById('chatrooms');
    chatroomsList.innerHTML = ''; // Limpiar listado

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Por favor, inicia sesión primero.');
            return;
        }

        const response = await fetch('/chatrooms', { //*
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al obtener las salas de chat: ${errorData.error}`);
        }

        const chatrooms = await response.json();

        if (chatrooms.length === 0) {
            chatroomsList.innerHTML = `<li>No se encontraron salas de chat disponibles.</li>`;
        } else {
            const chatList = chatrooms.map(chat => `
                <li class="chatroom-item">
                    <h4>Solicitud: ${chat.solicitud}</h4>
                    <p><strong>Usuarios:</strong> ${chat.usuarios.map(u => u.nombre).join(', ')}</p>
                    <button onclick="enterChatroom('${chat._id}')">Entrar</button>
                </li>
            `).join('');
            chatroomsList.innerHTML = chatList;
        }
    } catch (error) {
        console.error('Error al cargar las salas de chat:', error);
        alert('Hubo un problema al cargar las salas de chat.');
    }
}
