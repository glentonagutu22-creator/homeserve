
"use client";

import { useEffect, useState } from "react";

import { useAuth } from "../AuthProvider";

import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import BottomNavigation from "./BottomNavigation";

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  const {
    user,
    loading,
  } = useAuth();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [loading, user]);

  // Prevent background scrolling when
  // the mobile sidebar is open.
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white lg:flex-row">

      {/* DESKTOP SIDEBAR */}

      <div className="hidden h-screen shrink-0 lg:block">
        <DashboardSidebar />
      </div>

      {/* MOBILE SIDEBAR */}

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="
              absolute
              inset-0
              bg-black/40
              backdrop-blur-[1px]
            "
          />

          <div className="relative z-10 h-full w-64">
            <DashboardSidebar
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* MAIN APPLICATION */}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">

        <DashboardHeader
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* PAGE CONTENT */}

        <main className="min-h-0 flex-1 overflow-y-auto bg-white pb-20 lg:pb-0">
          {children}
        </main>

        {/* MOBILE BOTTOM NAVIGATION */}

        <BottomNavigation
          onMoreClick={() => setMobileOpen(true)}
        />

      </div>
    </div>
  );
}
