document.addEventListener('DOMContentLoaded', async () => {
    try {
        const chatroomsList = document.getElementById("chatrooms");
        if (!chatroomsList) {
            console.error('El contenedor de salas de chat no se encontró.');
            return; 
        }

        const response = await fetch('http://localhost:3000/chatrooms', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las salas de chat');
        }

        const chatrooms = await response.json();

        if (!chatrooms.length) {
            console.log('No hay salas de chat disponibles.');
            return;
        }

        chatrooms.forEach(room => {
            const li = document.createElement("li");
            li.textContent = `Sala : ${room.solicitud}`;
            console.log(room)
            li.onclick = () => {
                localStorage.setItem('chatroomId', room._id);
                window.location.href = '/chat/chat.html';
            };
            chatroomsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar las salas de chat:', error);
    }
});
