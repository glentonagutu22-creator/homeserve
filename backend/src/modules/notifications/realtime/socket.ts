import type { Server as HttpServer } from "http";
import { Server } from "socket.io";

import {
  authenticateSocket,
  type AuthenticatedSocket,
} from "./socket.auth";

let io: Server | null = null;

export function initializeSocket(
  server: HttpServer
): Server {
  io = new Server(server, {
    cors: {
      origin:
        process.env.FRONTEND_URL ||
        "http://localhost:3000",
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const authenticatedSocket =
      socket as AuthenticatedSocket;

    const { userId, role } =
      authenticatedSocket.user;

    /*
     * Private room for this specific user.
     */
    socket.join(`user:${userId}`);

    /*
     * Role-based room.
     *
     * Examples:
     * role:ADMIN
     * role:STAFF
     * role:CUSTOMER
     */
    socket.join(`role:${role}`);

    console.log(
      `Socket connected: ${userId} (${role})`
    );

    socket.on("disconnect", (reason) => {
      console.log(
        `Socket disconnected: ${userId} (${reason})`
      );
    });
  });

  console.log("Socket.IO initialized");

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized"
    );
  }

  return io;
}

export function getUserRoom(
  userId: string
): string {
  return `user:${userId}`;
}

export function getRoleRoom(
  role: string
): string {
  return `role:${role}`;
}