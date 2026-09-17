import "dotenv/config";
import app from "./app";
import http from "http";
import { initializeSocket } from "./modules/notifications/realtime/socket";

const PORT = Number(process.env.PORT) || 5000;

const httpServer = http.createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});