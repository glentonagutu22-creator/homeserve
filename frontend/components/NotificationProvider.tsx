"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/components/AuthProvider";
import { getSocket } from "@/lib/socket";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/notifications";

import type { Notification } from "@/types/notification";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (
    notificationId: string
  ) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext =
  createContext<NotificationContextValue | undefined>(
    undefined
  );

interface NotificationProviderProps {
  children: ReactNode;
}

export default function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(false);

  /*
   * Load all notifications belonging to
   * the currently authenticated user.
   */
  const refreshNotifications =
    useCallback(async () => {
      if (!user) {
        setNotifications([]);
        return;
      }

      try {
        setLoading(true);

        const data =
          await getNotifications();

        setNotifications(data);
      } catch (error) {
        console.error(
          "Failed to load notifications:",
          error
        );
      } finally {
        setLoading(false);
      }
    }, [user]);

  /*
   * Load notifications when authentication
   * has finished and a user is available.
   */
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setNotifications([]);
      return;
    }

    void refreshNotifications();
  }, [
    user,
    authLoading,
    refreshNotifications,
  ]);

  /*
   * Listen for real-time notifications and
   * socket reconnections.
   */
  useEffect(() => {
    if (!user || authLoading) {
      return;
    }

    const socket = getSocket();

    /*
     * A new notification has been created
     * for this user.
     */
    const handleNotification = (
      notification: Notification
    ) => {
      setNotifications((current) => {
        const exists = current.some(
          (item) =>
            item.id === notification.id
        );

        if (exists) {
          return current;
        }

        return [
          notification,
          ...current,
        ];
      });
    };

    /*
     * If the socket reconnects after a
     * temporary network interruption, reload
     * notifications from PostgreSQL.
     *
     * This recovers notifications that may
     * have been created while the browser
     * was disconnected.
     */
    const handleReconnect = () => {
      void refreshNotifications();
    };

    socket.on(
      "notification:new",
      handleNotification
    );

    socket.on(
      "connect",
      handleReconnect
    );

    return () => {
      socket.off(
        "notification:new",
        handleNotification
      );

      socket.off(
        "connect",
        handleReconnect
      );
    };
  }, [
    user,
    authLoading,
    refreshNotifications,
  ]);

  /*
   * Mark one notification as read.
   */
  const markAsRead = useCallback(
    async (notificationId: string) => {
      const updated =
        await markNotificationAsRead(
          notificationId
        );

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === updated.id
            ? updated
            : notification
        )
      );
    },
    []
  );

  /*
   * Mark every notification as read.
   */
  const markAllAsRead = useCallback(
    async () => {
      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
          readAt:
            notification.readAt ??
            new Date().toISOString(),
        }))
      );
    },
    []
  );

  /*
   * Calculate unread notifications from
   * the current client state.
   */
  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context =
    useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}