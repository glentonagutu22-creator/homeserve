import "dotenv/config";
import app from "./app";
import http from "http";
import { initializeSocket } from "./modules/notifications/realtime/socket";

const PORT = Number(process.env.PORT) || 5000;

const httpServer = http.createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});