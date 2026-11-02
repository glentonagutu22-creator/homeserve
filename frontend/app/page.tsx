
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  ShieldCheck,
  Sparkles,
  Star,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    title: "Professional Cleaning",
    description:
      "Enjoy a cleaner, fresher space with professional home and workspace cleaning.",
    href: "/services/cleaning",
    image: "/images/cleaning-service.webp",
    label: "CLEANING",
    accent: "blue",
    accentText: "text-blue-700",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-100",
    accentLine: "bg-blue-500",
  },
  {
    title: "Moving Services",
    description:
      "Make your next move easier with reliable relocation and moving assistance.",
    href: "/services/moving",
    image: "/images/moving-service.webp",
    label: "MOVING",
    accent: "green",
    accentText: "text-emerald-700",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-100",
    accentLine: "bg-emerald-500",
  },
  {
    title: "Electrical Services",
    description:
      "Get professional help with electrical installations, maintenance and repairs.",
    href: "/services/electrical",
    image: "/images/electrical-service.webp",
    label: "ELECTRICAL",
    accent: "amber",
    accentText: "text-amber-700",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-100",
    accentLine: "bg-amber-500",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose your service",
    description:
      "Browse our services and select the one that matches your needs.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    number: "02",
    title: "Tell us what you need",
    description:
      "Provide your location, service details and preferred schedule.",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    number: "03",
    title: "Track your booking",
    description:
      "Manage your request and stay updated as your service progresses.",
    color: "bg-amber-50 text-amber-700",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Professional service",
    description:
      "Structured service workflows designed to make every booking easier to manage.",
    color: "bg-blue-500/10 text-blue-300",
  },
  {
    icon: Clock3,
    title: "Convenient booking",
    description:
      "Request and manage services online without unnecessary back-and-forth.",
    color: "bg-emerald-500/10 text-emerald-300",
  },
  {
    icon: Sparkles,
    title: "Clear experience",
    description:
      "Understand your service, booking status and applicable pricing in one place.",
    color: "bg-amber-500/10 text-amber-300",
  },
  {
    icon: Star,
    title: "One platform",
    description:
      "Cleaning, moving and electrical services brought together under HomeServe.",
    color: "bg-violet-500/10 text-violet-300",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#061F35]">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-[74px] sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
          >
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src="/images/homeserve-logo.webp"
                alt="HomeServe logo"
                fill
                priority
                sizes="40px"
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-base font-black tracking-tight text-[#061F35]">
                HomeServe
              </p>
              <p className="hidden text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
                Professional Services
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="/services"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              Contact
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:block"
            >
              Login
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-[#061F35] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#0B3455] sm:px-5 sm:text-sm"
            >
              Book a Service
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* INTRODUCTION */}
      <section className="relative overflow-hidden bg-[#F7F9FC]">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-cyan-100/60 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-7 px-5 py-12 text-center sm:px-6 sm:py-16 md:flex-row md:justify-between md:gap-12 md:py-16 md:text-left lg:px-8 lg:py-20">
          <div className="order-2 max-w-2xl md:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              Professional services made simple
            </span>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-[#061F35] sm:text-4xl lg:text-5xl">
              Your home deserves
              <span className="block text-blue-600">
                professional care.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base md:mx-0">
              Welcome to HomeServe. Find reliable cleaning, moving and
              electrical services in one convenient place. Choose what
              you need, book online and manage your service with ease.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#061F35] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/10 transition hover:-translate-y-0.5 hover:bg-[#0B3455]"
              >
                Explore our services
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-[#061F35] transition hover:border-blue-200 hover:bg-blue-50"
              >
                Discover HomeServe
              </Link>
            </div>
          </div>

          <div className="order-1 flex w-full max-w-[190px] shrink-0 items-center justify-center md:order-2 md:max-w-[260px] lg:max-w-[300px]">
            <div className="relative aspect-square w-full">
              <Image
                src="/images/homeserve-logo.webp"
                alt="HomeServe brand logo"
                fill
                priority
                sizes="(max-width: 768px) 190px, 300px"
                className="object-contain drop-shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">
                What we offer
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#061F35] sm:text-3xl">
                Services designed around you
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Whatever your home or workspace needs, find the right
                professional service below.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-800"
            >
              View all services
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* One-column floating service cards */}
          <div className="mx-auto flex max-w-4xl flex-col gap-6">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className={`group relative grid overflow-hidden rounded-2xl border ${service.accentBorder} bg-white shadow-[0_8px_30px_rgba(6,31,53,0.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(6,31,53,0.12)] sm:grid-cols-[260px_1fr]`}
              >
                <div className="relative min-h-[190px] overflow-hidden bg-slate-100 sm:min-h-[210px]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 260px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061F35]/35 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#061F35]/5" />

                  <span
                    className={`absolute bottom-4 left-4 rounded-full ${service.accentBg} px-3 py-1.5 text-[9px] font-black tracking-[0.16em] ${service.accentText}`}
                  >
                    {service.label}
                  </span>
                </div>

                <div className="relative flex flex-col justify-center p-5 sm:p-7">
                  <div
                    className={`absolute bottom-0 left-0 top-0 hidden w-1 ${service.accentLine} sm:block`}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className={`inline-flex rounded-md ${service.accentBg} px-2.5 py-1 text-[9px] font-bold tracking-wider ${service.accentText}`}
                      >
                        HOMESERVE SERVICES
                      </span>

                      <h3 className="mt-3 text-xl font-black tracking-tight text-[#061F35] sm:text-2xl">
                        {service.title}
                      </h3>
                    </div>

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${service.accentBg} ${service.accentText} transition duration-300 group-hover:translate-x-1`}
                    >
                      <ArrowRight size={17} />
                    </div>
                  </div>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div
                    className={`mt-5 inline-flex items-center text-sm font-bold ${service.accentText}`}
                  >
                    Explore service
                    <ChevronRight
                      size={17}
                      className="ml-1 transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#F7F9FC] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">
              Simple process
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#061F35] sm:text-3xl">
              Getting started is easy
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              A straightforward booking experience from start to finish.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-xs font-black ${step.color}`}
                >
                  {step.number}
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#061F35]">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY HOMESERVE */}
      <section className="bg-[#061F35] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-300">
              Why HomeServe
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Professional services, made easier.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              From keeping your space clean to preparing for a move or
              handling electrical work, HomeServe brings your service
              needs together in one convenient platform.
            </p>

            <Link
              href="/about"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-300 transition hover:text-white"
            >
              Learn more about us
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition hover:bg-white/[0.08]"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${benefit.color}`}
                  >
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-4 font-bold text-white">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-[#F7F9FC] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-12 text-center shadow-xl shadow-blue-900/10 sm:px-12 sm:py-14">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">
            <CheckCircle2 size={23} />
          </div>

          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-blue-100">
            Get started today
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Ready to get things done?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
            Explore our services and book the professional help you need
            through HomeServe.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Browse services
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-9 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2.5"
              >
                <div className="relative h-10 w-10">
                  <Image
                    src="/images/homeserve-logo.webp"
                    alt="HomeServe logo"
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </div>

                <span className="text-lg font-black tracking-tight text-[#061F35]">
                  HomeServe
                </span>
              </Link>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                Professional cleaning, moving and electrical services
                made easier through one convenient platform.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#061F35]">
                Explore
              </h3>

              <div className="mt-4 space-y-3">
                <Link
                  href="/services"
                  className="block text-sm text-slate-500 transition hover:text-blue-600"
                >
                  Services
                </Link>
                <Link
                  href="/pricing"
                  className="block text-sm text-slate-500 transition hover:text-blue-600"
                >
                  Pricing
                </Link>
                <Link
                  href="/about"
                  className="block text-sm text-slate-500 transition hover:text-blue-600"
                >
                  About
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#061F35]">
                Support
              </h3>

              <div className="mt-4 space-y-3">
                <Link
                  href="/faq"
                  className="block text-sm text-slate-500 transition hover:text-blue-600"
                >
                  FAQ
                </Link>
                <Link
                  href="/contact"
                  className="block text-sm text-slate-500 transition hover:text-blue-600"
                >
                  Contact
                </Link>
                <Link
                  href="/login"
                  className="block text-sm text-slate-500 transition hover:text-blue-600"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} HomeServe. All rights reserved.
            </p>
            <p>Professional services made simple.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
