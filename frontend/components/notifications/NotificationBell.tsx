"use client";

import {
  Bell,
} from "lucide-react";

import {
  useNotifications,
} from "@/components/NotificationProvider";

interface NotificationBellProps {
  onClick?: () => void;
}

export default function NotificationBell({
  onClick,
}: NotificationBellProps) {
  const {
    unreadCount,
  } = useNotifications();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Notifications"
      className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-[#061F35]"
    >
      <Bell className="h-5 w-5" />

      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unreadCount > 99
            ? "99+"
            : unreadCount}
        </span>
      )}
    </button>
  );
}