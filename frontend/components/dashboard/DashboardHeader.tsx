"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";

import { useAuth } from "../AuthProvider";
import { useNotifications } from "../NotificationProvider";
import NotificationPanel from "../notifications/NotificationPanel";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const {
    unreadCount,
  } = useNotifications();

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await logout();

      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <header
      className="
        relative
        flex
        h-16
        shrink-0
        items-center
        justify-between
        bg-[#082B49]
        px-4
        sm:px-6
      "
    >
      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <button
        type="button"
        onClick={onMenuClick}
        className="
          rounded-lg
          p-2
          text-white
          transition
          hover:bg-white/10
          lg:hidden
        "
        aria-label="Open navigation"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      </button>

      {/* =====================================================
          WELCOME
      ===================================================== */}

      <div className="hidden lg:block">
        <p className="text-xs text-white/60">
          Welcome back
        </p>

        <p className="mt-0.5 font-semibold text-white">
          {user?.name || "User"}
        </p>
      </div>

      {/* =====================================================
          USER ACTIONS
      ===================================================== */}

      <div className="ml-auto flex items-center gap-3">

        {/* =================================================
            NOTIFICATION BELL
        ================================================= */}

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowNotifications(
                (current) => !current
              )
            }
            aria-label="Notifications"
            aria-expanded={
              showNotifications
            }
            className="
              relative
              rounded-lg
              p-2
              text-white
              transition
              hover:bg-white/10
            "
          >
            <Bell className="h-5 w-5" />

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  -right-0.5
                  -top-0.5
                  flex
                  min-h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[10px]
                  font-bold
                  text-white
                  ring-2
                  ring-[#082B49]
                "
              >
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {/* =================================================
              NOTIFICATION DROPDOWN
          ================================================= */}

          {showNotifications && (
            <>
              {/* Mobile backdrop */}

              <button
                type="button"
                aria-label="Close notifications"
                onClick={() =>
                  setShowNotifications(false)
                }
                className="
                  fixed
                  inset-0
                  z-40
                  bg-black/20
                  lg:hidden
                "
              />

              <div
                className="
                  fixed
                  left-4
                  right-4
                  top-20
                  z-50
                  sm:left-auto
                  sm:right-6
                  sm:w-[420px]
                  lg:absolute
                  lg:right-0
                  lg:top-12
                "
              >
                <div className="relative">

                  {/* Mobile close button */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowNotifications(false)
                    }
                    aria-label="Close notifications"
                    className="
                      absolute
                      right-3
                      top-3
                      z-10
                      rounded-lg
                      p-1.5
                      text-slate-500
                      transition
                      hover:bg-slate-100
                      hover:text-slate-900
                      sm:hidden
                    "
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <NotificationPanel />
                </div>
              </div>
            </>
          )}
        </div>

        {/* =================================================
            USER INFORMATION
        ================================================= */}

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-white">
            {user?.name || "User"}
          </p>

          <p className="text-xs text-white/60">
            {user?.role || "CUSTOMER"}
          </p>
        </div>

        {/* =================================================
            AVATAR
        ================================================= */}

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white/10
            text-sm
            font-bold
            text-white
            ring-1
            ring-white/20
          "
        >
          {user?.name
            ?.charAt(0)
            .toUpperCase() || "U"}
        </div>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="
            rounded-lg
            border
            border-white/20
            px-3
            py-2
            text-xs
            font-semibold
            text-white
            transition
            hover:bg-white/10
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loggingOut
            ? "Logging out..."
            : "Logout"}
        </button>
      </div>
    </header>
  );
}