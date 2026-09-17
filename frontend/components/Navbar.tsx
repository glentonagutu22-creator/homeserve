"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
    window.location.href = "/login";
  };

  const getDashboardPath = () => {
    if (!user) return "/login";

    switch (user.role) {
      case "ADMIN":
        return "/admin";

      case "STAFF":
        return "/staff";

      default:
        return "/dashboard";
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#082B49]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6">

        {/* =====================================================
            BRAND
        ===================================================== */}

        <Link
          href="/services"
          onClick={closeMobileMenu}
          className="shrink-0"
        >
          <img
            src="/images/image.png"
            alt="HomeServe"
            className="w-36 brightness-20 invert sm:w-44"
          />
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <nav className="hidden items-center gap-8 md:flex">

          <Link
            href="/services"
            className="text-sm font-semibold text-white/85 transition hover:text-blue-400"
          >
            Services
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-white/85 transition hover:text-blue-400"
          >
            About
          </Link>

          <Link
            href="/pricing"
            className="text-sm font-medium text-white/85 transition hover:text-blue-400"
          >
            Pricing
          </Link>

          <Link
            href="/faq"
            className="text-sm font-medium text-white/85 transition hover:text-blue-400"
          >
            FAQ
          </Link>

          <Link
            href="/contact"
            className="text-sm font-medium text-white/85 transition hover:text-blue-400"
          >
            Contact
          </Link>

        </nav>

        {/* =====================================================
            DESKTOP ACTIONS
        ===================================================== */}

        <div className="hidden items-center gap-3 md:flex">
          {!loading && user ? (
            <>
              <Link
                href={getDashboardPath()}
                className="
                  rounded-xl
                  border border-slate-300
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white/85
                  transition
                  hover:border-blue-500
                  hover:text-blue-400
                "
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="
                  rounded-xl
                  bg-[#061F35]
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white/85
                  transition
                  hover:bg-[#0B3A61]
                "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="
                  rounded-xl
                  border border-white/40
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white
                  transition
                  hover:border-white
                  hover:bg-white/10
                "
              >
                Login
              </Link>

              <Link
                href="/register"
                className="
                  rounded-xl
                  bg-[#F5B82E]
                  px-5 py-2.5
                  text-sm font-bold
                  text-[#082B49]
                  transition
                  hover:bg-[#e9aa20]
                "
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}

        <button
          type="button"
          aria-label={
            mobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
          className="
            flex h-11 w-11
            items-center justify-center
            rounded-xl
            border border-white/15
            bg-white/5
            text-white
            transition
            hover:bg-white/10
            md:hidden
          "
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">

          {/* Dark backdrop */}

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
            className="
              absolute
              inset-0
              bg-black/40
              backdrop-blur-[2px]
            "
          />

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside
            className="
              absolute
              right-0
              top-0
              h-full
              w-[82%]
              max-w-sm
              overflow-y-auto
              bg-white
              shadow-2xl
            "
          >

            {/* Sidebar header */}

            <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">

              <Link
                href="/services"
                onClick={closeMobileMenu}
                className="shrink-0"
              >
                <img
                  src="/images/image.png"
                  alt="HomeServe"
                  className="w-32"
                />
              </Link>

              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={closeMobileMenu}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-100
                  text-slate-700
                  transition
                  hover:bg-slate-200
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M18 6L6 18"
                  />
                </svg>
              </button>

            </div>

            {/* Sidebar navigation */}

            <nav className="px-5 py-6">

              <div className="space-y-1">

                <MobileSidebarLink
                  href="/services"
                  onClick={closeMobileMenu}
                  active
                >
                  Services
                </MobileSidebarLink>

                {/* Service categories */}

                <div className="ml-4 border-l-2 border-slate-100 pl-3">

                  <MobileSidebarLink
                    href="/services/cleaning"
                    onClick={closeMobileMenu}
                    small
                  >
                    Cleaning
                  </MobileSidebarLink>

                  <MobileSidebarLink
                    href="/services/moving"
                    onClick={closeMobileMenu}
                    small
                  >
                    Moving
                  </MobileSidebarLink>

                  <MobileSidebarLink
                    href="/services/electrical"
                    onClick={closeMobileMenu}
                    small
                  >
                    Electrical
                  </MobileSidebarLink>

                </div>

                <MobileSidebarLink
                  href="/about"
                  onClick={closeMobileMenu}
                >
                  About
                </MobileSidebarLink>

                <MobileSidebarLink
                  href="/pricing"
                  onClick={closeMobileMenu}
                >
                  Pricing
                </MobileSidebarLink>

                <MobileSidebarLink
                  href="/faq"
                  onClick={closeMobileMenu}
                >
                  FAQ
                </MobileSidebarLink>

                <MobileSidebarLink
                  href="/contact"
                  onClick={closeMobileMenu}
                >
                  Contact
                </MobileSidebarLink>

              </div>

              {/* Divider */}

              <div className="my-6 border-t border-slate-200" />

              {/* =================================================
                  AUTH ACTIONS
              ================================================= */}

              {!loading && user ? (
                <div className="space-y-3">

                  <Link
                    href={getDashboardPath()}
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-xl
                      bg-[#082B49]
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#061F35]
                    "
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="
                      block
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-slate-700
                      transition
                      hover:bg-slate-100
                    "
                  >
                    Logout
                  </button>

                </div>
              ) : (
                <div className="space-y-3">

                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-[#082B49]
                      transition
                      hover:bg-slate-50
                    "
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-xl
                      bg-[#F5B82E]
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-bold
                      text-[#082B49]
                      transition
                      hover:bg-[#e9aa20]
                    "
                  >
                    Get Started
                  </Link>

                </div>
              )}

            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}

/* ============================================================
   MOBILE SIDEBAR LINK
============================================================ */

function MobileSidebarLink({
  href,
  children,
  onClick,
  small = false,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  small?: boolean;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex
        items-center
        rounded-xl
        px-4
        ${
          small
            ? "py-2.5 text-sm"
            : "py-3.5 text-base"
        }
        font-semibold
        ${
          active
            ? "bg-blue-50 text-blue-700"
            : "text-slate-700"
        }
        transition
        hover:bg-slate-100
        hover:text-[#082B49]
      `}
    >
      {children}
    </Link>
  );
}