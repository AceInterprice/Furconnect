import dotenv from "dotenv";
dotenv.config();
import server from "./src/server.js";

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Servidor iniciado, escuchando en puerto ${port}`);
});
