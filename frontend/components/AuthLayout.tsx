import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  mode: "register" | "login";
}

export default function AuthLayout({
  children,
  mode,
}: AuthLayoutProps) {
  const isRegister = mode === "register";

  return (
    <main className="min-h-screen bg-sky-100">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">

        {/* =========================
            LEFT BRANDING
        ========================== */}
        <section className="relative hidden min-h-screen overflow-hidden lg:flex">

          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/images/homeserve-bg.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-sky-50/45" />

          <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-sky-100/30" />

          <div className="relative z-10 flex w-full flex-col justify-between px-10 py-10 xl:px-16">

            {/* Logo */}
            <div>
              <img
                src="/images/homeserve-logo.png"
                alt="HomeServe"
                className="w-60 xl:w-64"
              />
            </div>

            {/* Main branding */}
            <div className="max-w-xl">

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-600">
                More Than Services
              </p>

              <h2 className="text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 xl:text-6xl">
                Your Home.
                <br />

                <span className="text-blue-600">
                  Our Expertise.
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-lg leading-8 text-slate-700">
                Professional cleaning, moving and
                electrical services at your convenience.
              </p>

              {/* Services */}
              <div className="mt-7 grid max-w-2xl grid-cols-3 gap-3">

                <ServiceCard
                  icon="✦"
                  title="Cleaning"
                  description="A cleaner, healthier space"
                  iconStyle="bg-blue-100 text-blue-600"
                />

                <ServiceCard
                  icon="↗"
                  title="Moving"
                  description="Safe and reliable relocation"
                  iconStyle="bg-green-100 text-green-600"
                />

                <ServiceCard
                  icon="⚡"
                  title="Electrical"
                  description="Reliable electrical solutions"
                  iconStyle="bg-amber-100 text-amber-600"
                />

              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-slate-700">
              <span>🛡 Trusted Professionals</span>
              <span>◷ On-Time Service</span>
              <span>♡ A Happier Home</span>
            </div>

          </div>
        </section>

        {/* =========================
            RIGHT AUTH AREA
        ========================== */}
        <section className="flex min-h-screen items-center justify-center bg-sky-100 px-5 py-8 sm:px-8">

          <div className="w-full max-w-[390px]">

            {/* Mobile logo */}
            <div className="mb-5 flex justify-center lg:hidden">
              <img
                src="/images/homeserve-logo.png"
                alt="HomeServe"
                className="w-44"
              />
            </div>

            {/* DARK BLUE FORM CARD */}
            <div className="rounded-2xl bg-[#082B49] p-6 shadow-2xl shadow-blue-900/20 sm:p-7">

              {/* Top navigation */}
              <div className="mb-5 flex justify-end">
                <p className="text-xs text-slate-300">
                  {isRegister
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}

                  <Link
                    href={
                      isRegister
                        ? "/login"
                        : "/register"
                    }
                    className="font-semibold text-sky-300 transition hover:text-white"
                  >
                    {isRegister
                      ? "Login"
                      : "Register"}
                  </Link>
                </p>
              </div>

              {/* Header */}
              <div className="mb-5">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {isRegister
                    ? "Create your account"
                    : "Welcome back"}
                </h1>

                <p className="mt-1.5 text-sm leading-5 text-slate-300">
                  {isRegister
                    ? "Join HomeServe and get started today."
                    : "Sign in to manage your services and bookings."}
                </p>
              </div>

              {children}

            </div>

            <p className="mt-4 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} HomeServe. All rights reserved.
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  iconStyle: string;
}

function ServiceCard({
  icon,
  title,
  description,
  iconStyle,
}: ServiceCardProps) {
  return (
    <div className="rounded-xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur-md">

      <div
        className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg text-lg ${iconStyle}`}
      >
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-600">
        {description}
      </p>

    </div>
  );
}
