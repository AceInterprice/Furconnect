import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import { setupChatSocket } from "./sockets/chat.socket.js";


// Crear servidor HTTP
const server = http.createServer(app);

//Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Configurar sockets
setupChatSocket(io);

export default server;
