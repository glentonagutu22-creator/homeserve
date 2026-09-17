"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  connectSocket,
  disconnectSocket,
} from "@/lib/socket";

import { useAuth } from "@/components/AuthProvider";

interface SocketContextValue {
  connected: boolean;
}

const SocketContext =
  createContext<SocketContextValue>({
    connected: false,
  });

interface SocketProviderProps {
  children: ReactNode;
}

export default function SocketProvider({
  children,
}: SocketProviderProps) {
  const { user, loading } = useAuth();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    /*
     * Don't connect while authentication
     * is still being resolved.
     */
    if (loading) {
      return;
    }

    /*
     * No authenticated user means there is
     * no reason to maintain a socket connection.
     */
    if (!user) {
      disconnectSocket();
      setConnected(false);
      return;
    }

    const socket = connectSocket();

    const handleConnect = () => {
      console.log(
        "Socket connected:",
        socket.id
      );

      setConnected(true);
    };

    const handleDisconnect = (
      reason: string
    ) => {
      console.log(
        "Socket disconnected:",
        reason
      );

      setConnected(false);
    };

    const handleConnectError = (
      error: Error
    ) => {
      console.error(
        "Socket connection error:",
        error.message
      );

      setConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(
      "connect_error",
      handleConnectError
    );

    /*
     * If the socket was already connected
     * before these listeners were attached.
     */
    if (socket.connected) {
      setConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off(
        "disconnect",
        handleDisconnect
      );
      socket.off(
        "connect_error",
        handleConnectError
      );
    };
  }, [user, loading]);

  return (
    <SocketContext.Provider
      value={{ connected }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}