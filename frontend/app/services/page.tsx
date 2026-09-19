import Image from "next/image";
import Link from "next/link";
import { getServicesByCategory } from "@/lib/services";

export default async function ServicesPage() {
  const [
    cleaningServices,
    movingServices,
    electricalServices,
  ] = await Promise.all([
    getServicesByCategory("cleaning"),
    getServicesByCategory("moving"),
    getServicesByCategory("electrical"),
  ]);

  return (
    <main className="min-h-screen bg-[#082B49]">
      {/* =========================================================
          FIXED TOP BAR
      ========================================================= */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* BRAND */}
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2.5"
          >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl sm:h-12 sm:w-12">
              <Image
                src="/images/homeserve-logo.png"
                alt="HomeServe"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[16px] font-black tracking-tight text-[#061F35] sm:text-[17px]">
                HomeServe
              </p>

              <p className="hidden text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400 sm:block">
                Professional Services
              </p>
            </div>
          </Link>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-[#061F35] transition hover:bg-slate-100 sm:block"
            >
              Login
            </Link>

            <Link
              href="/services"
              className="rounded-xl bg-[#082B49] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b3a61]"
            >
              Book a Service
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================
          PAGE CONTENT
      ========================================================= */}
      <div className="pt-[72px]">
        {/* =======================================================
            HERO
        ======================================================= */}
        <section className="relative overflow-hidden bg-white">
          {/* Background logo / visual */}
          <div
            className="
              absolute right-0 top-0
              h-[38%] w-full
              bg-contain bg-right-top bg-no-repeat
              sm:h-[42%]
              lg:h-full lg:w-[55%]
              lg:bg-[length:95%]
              lg:bg-center
            "
            style={{
              backgroundImage: "url('/images/image.png')",
            }}
          />

          {/* Hero content */}
          <div
            className="
              relative mx-auto max-w-7xl
              px-5 pb-12 pt-[48vh]
              sm:px-8 sm:pt-[45vh]
              lg:flex lg:min-h-[680px]
              lg:items-center
              lg:px-12
              lg:py-20
            "
          >
            <div className="w-full max-w-xl">
              {/* Brand label */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-blue-600" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#082B49]">
                  HomeServe Kenya
                </span>
              </div>

              {/* Heading */}
              <h1 className="max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight text-[#082B49] sm:text-5xl lg:text-6xl">
                Professional Services.
                <br />

                <span className="text-blue-600">
                  A Brighter Home.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-5 max-w-md text-base leading-7 text-slate-600 sm:text-lg">
                Cleaning, moving and electrical services
                delivered by trusted professionals.
              </p>

              {/* Service buttons */}
              <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row">
                <ServiceButton
                  href="/services/cleaning"
                  icon="✦"
                  title="Cleaning"
                  count={cleaningServices.length}
                  color="blue"
                />

                <ServiceButton
                  href="/services/moving"
                  icon="↗"
                  title="Moving"
                  count={movingServices.length}
                  color="green"
                />

                <ServiceButton
                  href="/services/electrical"
                  icon="⚡"
                  title="Electrical"
                  count={electricalServices.length}
                  color="amber"
                />
              </div>

              {/* Trust indicators */}
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                <span>✓ Trusted Professionals</span>
                <span>✓ Convenient Scheduling</span>
                <span>✓ Reliable Service</span>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            FOOTER
        ======================================================= */}
        <footer className="bg-[#061F35] text-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
            {/* Main footer */}
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
              {/* Brand */}
              <div className="max-w-sm">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                >
                  <div className="relative h-11 w-11 overflow-hidden rounded-xl">
                    <Image
                      src="/images/homeserve-logo.png"
                      alt="HomeServe"
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-lg font-black">
                      HomeServe
                    </p>

                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Professional Services
                    </p>
                  </div>
                </Link>

                <p className="mt-5 text-sm leading-6 text-slate-400">
                  Reliable cleaning, moving and electrical services
                  delivered by trusted professionals across Kenya.
                </p>
              </div>

              {/* Explore links */}
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Explore
                </p>

                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <Link
                    href="/services"
                    className="text-slate-300 transition hover:text-white"
                  >
                    Services
                  </Link>

                  <Link
                    href="/about"
                    className="text-slate-300 transition hover:text-white"
                  >
                    About
                  </Link>

                  <Link
                    href="/pricing"
                    className="text-slate-300 transition hover:text-white"
                  >
                    Pricing
                  </Link>

                  <Link
                    href="/faq"
                    className="text-slate-300 transition hover:text-white"
                  >
                    FAQ
                  </Link>

                  <Link
                    href="/contact"
                    className="text-slate-300 transition hover:text-white"
                  >
                    Contact
                  </Link>

                  <Link
                    href="/login"
                    className="text-slate-300 transition hover:text-white"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom footer */}
            <div className="mt-10 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  © {new Date().getFullYear()} HomeServe. All rights reserved.
                </p>

                <p>
                  Professional services made simple.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* ===============================================================
   SERVICE BUTTON
================================================================ */

interface ServiceButtonProps {
  href: string;
  icon: string;
  title: string;
  count: number;
  color: "blue" | "green" | "amber";
}

function ServiceButton({
  href,
  icon,
  title,
  count,
  color,
}: ServiceButtonProps) {
  const styles = {
    blue: {
      wrapper:
        "border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100",
      icon: "bg-blue-600 text-white",
      arrow: "text-blue-600",
    },

    green: {
      wrapper:
        "border-green-200 bg-green-50 hover:border-green-400 hover:bg-green-100",
      icon: "bg-green-600 text-white",
      arrow: "text-green-600",
    },

    amber: {
      wrapper:
        "border-amber-200 bg-amber-50 hover:border-amber-400 hover:bg-amber-100",
      icon: "bg-amber-500 text-white",
      arrow: "text-amber-600",
    },
  };

  const style = styles[color];

  return (
    <Link
      href={href}
      className={`group flex w-full min-w-0 flex-1 items-center gap-3 rounded-2xl border px-3 py-3 transition duration-200 hover:-translate-y-0.5 sm:w-auto ${style.wrapper}`}
    >
      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${style.icon}`}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#082B49]">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] text-slate-500">
          {count} services
        </p>
      </div>

      {/* Arrow */}
      <span
        className={`text-lg font-bold transition-transform duration-200 group-hover:translate-x-1 ${style.arrow}`}
      >
        →
      </span>
    </Link>
  );
}