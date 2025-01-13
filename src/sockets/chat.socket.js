import ChatRoom from "../models/chatroom.model.js";
import User from "../models/user.model.js";

export const setupChatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Usuario conectado:", socket.id);

        socket.on("chatRoomCreated", (chatRoom) => {
            const chatRoomId = chatRoom._id;
            socket.join(chatRoomId);
            console.log(`Usuario se unió a la sala: ${chatRoomId}`);
        });

        socket.on("joinRoom", async (chatRoomId) => {
            console.log(`Usuario se unió a la sala: ${chatRoomId}`);
            socket.join(chatRoomId);

            try {
                const chatRoom = await ChatRoom.findById(chatRoomId).populate({
                    path: "mensajes.sender",
                    select: "nombre email", 
                });

                if (chatRoom) {
                    const mensajesConNombres = chatRoom.mensajes.map((mensaje) => ({
                        content: mensaje.content,
                        timestamp: mensaje.timestamp,
                        sender: mensaje.sender?._id,
                        senderName: mensaje.sender?.nombre || "Usuario desconocido",
                        senderEmail: mensaje.sender?.email || "No disponible",
                    }));

                    socket.emit("loadMessages", mensajesConNombres);
                } else {
                    console.log("Sala no encontrada:", chatRoomId);
                }
            } catch (error) {
                console.error("Error al cargar los mensajes:", error);
            }
        });

        socket.on("sendMessage", async ({ chatRoomId, sender, content }) => {
            console.log("Recibiendo mensaje para la sala:", chatRoomId);

            try {
                const chatRoom = await ChatRoom.findById(chatRoomId);
                if (chatRoom) {
                    const message = { sender, content, timestamp: new Date() };
                    chatRoom.mensajes.push(message);
                    await chatRoom.save();

                    const user = await User.findById(sender, "nombre email");

                    const messageWithSenderName = {
                        content: message.content,
                        timestamp: message.timestamp,
                        sender: message.sender,
                        senderName: user?.nombre || "Usuario desconocido",
                        senderEmail: user?.email || "No disponible",
                    };

                    io.to(chatRoomId).emit("receiveMessage", messageWithSenderName);
                    console.log("Mensaje enviado a la sala:", chatRoomId);
                } else {
                    console.log("Sala no encontrada:", chatRoomId);
                }
            } catch (error) {
                console.error("Error al enviar el mensaje:", error);
            }
        });

        socket.on("online", (userId) => {
            socket.broadcast.emit("userOnline", userId);
        });

        socket.on("disconnect", () => {
            console.log("Usuario desconectado:", socket.id);
        });
    });
};
