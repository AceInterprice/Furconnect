// Importar Socket.IO desde un módulo (asegúrate de que `socket.io` esté disponible como un módulo)
import { io } from "https://cdn.socket.io/4.6.1/socket.io.esm.min.js";

// Inicializar el socket
const socket = io();

// Verificar conexión
socket.on("connect", () => {
    console.log("Conectado al servidor Socket.io con id:", socket.id);
});

// Página de chat
if (window.location.pathname === '/chat/chat.html') {
    const chatroomId = localStorage.getItem('chatroomId');
    const chatroomIdSpan = document.getElementById("chatroom-id");
    const messagesDiv = document.getElementById("messages");
    const messageInput = document.getElementById("message-input");
    const sendMessageButton = document.getElementById("send-message");
    const userId = localStorage.getItem('userID');
    
    if (!chatroomId) {
        console.error('No se ha seleccionado ninguna sala');
    } else {
        chatroomIdSpan.textContent = chatroomId;

        // Unirse a la sala de chat
        socket.emit("joinRoom", chatroomId);

        socket.on("connect", () => {
            console.log(`Cliente unido a la sala: ${chatroomId}`);
        });

        // Recibir mensajes
        socket.on("receiveMessage", (message) => {
            const msgDiv = document.createElement("div");
            msgDiv.textContent = `${message.senderName}: ${message.content}`;
            messagesDiv.appendChild(msgDiv);
        });

        // Recibir los mensajes de la sala cuando se une
        socket.on("loadMessages", (messages) => {
            // Limpiar los mensajes anteriores
            messagesDiv.innerHTML = '';

            // Mostrar los mensajes cargados desde la base de datos
            messages.forEach((message) => {
                const msgDiv = document.createElement("div");
                msgDiv.textContent = `${message.senderName}: ${message.content}`;
                messagesDiv.appendChild(msgDiv);
            });
        });

        // Enviar mensaje
        sendMessageButton.onclick = () => {
            const messageContent = messageInput.value;
            if (messageContent.trim()) {
                const sender = userId; // Esto debería ser dinámico basado en el usuario logueado
                socket.emit("sendMessage", { 
                    chatRoomId: chatroomId, 
                    sender, 
                    content: messageContent 
                });
                messageInput.value = ''; // Limpiar el campo de entrada
            }
        };
    }
}
