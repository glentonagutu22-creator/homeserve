"use client";

import Link from "next/link";
import {
  Bell,
  CheckCheck,
} from "lucide-react";

import { useAuth } from "@/components/AuthProvider";

import {
  useNotifications,
} from "@/components/NotificationProvider";

function formatNotificationTime(
  date: string
) {
  return new Date(date).toLocaleString(
    "en-KE",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function getNotificationLink(
  notification: {
    relatedEntity: string | null;
    relatedEntityId: string | null;
  },
  role?: string
) {
  if (
    !notification.relatedEntity ||
    !notification.relatedEntityId
  ) {
    return null;
  }

  switch (notification.relatedEntity) {
    case "BOOKING":
      if (role === "ADMIN") {
        return `/admin/bookings/${notification.relatedEntityId}`;
      }

      if (role === "STAFF") {
        return `/staff/bookings/${notification.relatedEntityId}`;
      }

      return `/bookings/${notification.relatedEntityId}`;

    case "QUOTE":
      if (role === "ADMIN") {
        return `/admin/quotes/${notification.relatedEntityId}`;
      }

      return `/quotes/${notification.relatedEntityId}`;

    default:
      return null;
  }
}

export default function NotificationPanel() {
  const { user } = useAuth();

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="font-bold text-[#061F35]">
            Notifications
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            {unreadCount} unread
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      <div className="max-h-[480px] overflow-y-auto">
        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Bell className="h-5 w-5 text-slate-500" />
            </div>

            <p className="mt-4 font-semibold text-slate-900">
              No notifications
            </p>

            <p className="mt-1 text-sm text-slate-500">
              You're all caught up.
            </p>
          </div>
        ) : (
          notifications.map(
            (notification) => {
              const link =
                getNotificationLink(
                  notification,
                  user?.role
                );

              const content = (
                <div
                  className={`border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 ${
                    !notification.isRead
                      ? "bg-blue-50/60"
                      : "bg-white"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Unread indicator */}

                    {!notification.isRead && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900">
                        {notification.title}
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-600">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {formatNotificationTime(
                          notification.createdAt
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );

              {/* =================================================
                  LINKED NOTIFICATION
              ================================================= */}

              if (link) {
                return (
                  <Link
                    key={notification.id}
                    href={link}
                    onClick={() => {
                      if (
                        !notification.isRead
                      ) {
                        void markAsRead(
                          notification.id
                        );
                      }
                    }}
                  >
                    {content}
                  </Link>
                );
              }

              {/* =================================================
                  NOTIFICATION WITHOUT LINK
              ================================================= */}

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => {
                    if (
                      !notification.isRead
                    ) {
                      void markAsRead(
                        notification.id
                      );
                    }
                  }}
                  className="block w-full text-left"
                >
                  {content}
                </button>
              );
            }
          )
        )}
      </div>
    </div>
  );
}