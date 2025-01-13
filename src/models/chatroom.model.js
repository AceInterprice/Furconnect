import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Relación con el modelo User
    content: String,
    timestamp: { type: Date, default: Date.now },
});

const chatRoomSchema = new mongoose.Schema({
    nombre: String,
    usuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Usuarios de la sala
    mensajes: [mensajeSchema],
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
export default ChatRoom;
