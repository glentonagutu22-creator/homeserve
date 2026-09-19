import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

const services = [
  {
    title: "Professional Cleaning",
    description:
      "Keep your home or workspace fresh with dependable professional cleaning services.",
    href: "/services/cleaning",
    image: "/images/cleaning-brand.png/image.png",
    label: "CLEANING",
    accent: "blue",
  },
  {
    title: "Moving Services",
    description:
      "Make relocation easier with dependable moving and professional assistance.",
    href: "/services/moving",
    image: "/images/moving-brand.png/image.png",
    label: "MOVING",
    accent: "green",
  },
  {
    title: "Electrical Services",
    description:
      "Get professional electrical installation, maintenance and repair services.",
    href: "/services/electrical",
    image: "/images/electrical-brand.png/image.png",
    label: "ELECTRICAL",
    accent: "amber",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose your service",
    description:
      "Browse our professional services and select the option that matches your needs.",
  },
  {
    number: "02",
    title: "Tell us what you need",
    description:
      "Provide your service details, location and preferred schedule through a simple booking flow.",
  },
  {
    number: "03",
    title: "Relax while we handle it",
    description:
      "Track your booking and receive updates as your service progresses from confirmation to completion.",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Professional service",
    description:
      "Structured service workflows designed to make every booking easier to manage.",
  },
  {
    icon: Clock3,
    title: "Convenient booking",
    description:
      "Request and manage services online without unnecessary back-and-forth.",
  },
  {
    icon: Sparkles,
    title: "Clear experience",
    description:
      "Understand your service, booking status and applicable pricing in one place.",
  },
  {
    icon: Star,
    title: "One platform",
    description:
      "Cleaning, moving and electrical services brought together under HomeServe.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#061F35]">
      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between gap-3 px-3 sm:h-[76px] sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2.5"
          >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl sm:h-12 sm:w-12">
              <Image
                src="/images/homeserve-logo.png"
                alt="HomeServe"
                fill
                priority
                sizes="48px"
                className="object-contain"
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

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/services"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
            >
              Services
            </Link>

            <Link
              href="/about"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
            >
              About
            </Link>

            <Link
              href="/pricing"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
            >
              Pricing
            </Link>

            <Link
              href="/faq"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
            >
              FAQ
            </Link>

            <Link
              href="/contact"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-[#061F35] sm:block sm:px-4"
            >
              Login
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#061F35] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#082B49] sm:px-5 sm:text-sm"
            >
              <span className="whitespace-nowrap">
                Book a Service
              </span>

              <ArrowRight
                size={14}
                className="shrink-0 sm:h-4 sm:w-4"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#061F35]">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-cyan-400/5 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
          {/* Hero content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/15 bg-blue-400/10 px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                Professional services made simple
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-[4.25rem]">
              Reliable services.
              <span className="mt-2 block text-blue-400">
                Right where you need them.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              HomeServe connects you with professional services for
              cleaning, moving and electrical work. Book what you need,
              manage your service and stay updated from one place.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500"
              >
                Explore Services

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.08]"
              >
                Create an Account
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 grid max-w-xl grid-cols-3 border-t border-white/10 pt-7">
              <div>
                <p className="text-2xl font-black text-white">
                  3
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Service categories
                </p>
              </div>

              <div className="border-l border-white/10 pl-5 sm:pl-7">
                <p className="text-2xl font-black text-white">
                  24/7
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Booking access
                </p>
              </div>

              <div className="border-l border-white/10 pl-5 sm:pl-7">
                <p className="text-2xl font-black text-white">
                  1
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Simple platform
                </p>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative lg:pl-5">
            <div className="relative mx-auto w-full max-w-[570px]">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white p-3 sm:p-4">
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[22px] bg-white">
                  <Image
                    src="/images/homeserve-logo.png"
                    alt="HomeServe"
                    fill
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 570px"
                    className="object-contain p-5 sm:p-8 lg:p-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section className="bg-[#F7F9FC] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600">
                Our Services
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#061F35] sm:text-4xl">
                Professional help for everyday needs
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                Choose from carefully structured service categories designed
                to make booking professional help straightforward.
              </p>
            </div>

            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-sm font-bold text-blue-600"
            >
              View all services

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.map((service) => {
              const accentClasses = {
                blue: "bg-blue-50 text-blue-600",
                green: "bg-green-50 text-green-600",
                amber: "bg-amber-50 text-amber-600",
              };

              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

                    <div className="absolute bottom-4 left-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-[9px] font-black tracking-[0.18em] ${
                          accentClasses[
                            service.accent as keyof typeof accentClasses
                          ]
                        }`}
                      >
                        {service.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold tracking-tight text-[#061F35]">
                        {service.title}
                      </h3>

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-blue-200 group-hover:text-blue-600">
                        <ArrowRight size={15} />
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {service.description}
                    </p>

                    <div className="mt-6 flex items-center text-sm font-bold text-blue-600">
                      Explore service

                      <ChevronRight
                        size={16}
                        className="ml-1 transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#061F35] sm:text-4xl">
              From request to service in three steps
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              HomeServe keeps the process simple so you can focus on what
              matters.
            </p>
          </div>

          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            <div className="absolute left-[16.66%] right-[16.66%] top-12 hidden h-px bg-slate-200 md:block" />

            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-3xl border border-slate-200 bg-white p-7"
              >
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-[#061F35] text-xs font-black text-white">
                  {step.number}
                </div>

                <h3 className="mt-7 text-xl font-bold tracking-tight text-[#061F35]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY HOMESERVE
      ===================================================== */}

      <section className="bg-[#061F35] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-300">
              Why HomeServe
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              A better way to manage professional services.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Whether you need your home cleaned, you&apos;re preparing for
              a move or you need electrical work, HomeServe gives you one
              straightforward place to request and manage your service.
            </p>

            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-blue-300 transition hover:text-blue-200"
            >
              Learn more about HomeServe

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
                  className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 transition hover:bg-white/[0.07]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 font-bold text-white">
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

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="bg-[#F7F9FC] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-blue-600 px-6 py-14 text-center sm:px-12 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-100">
            Get started
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Need a professional service?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
            Explore our services and make your booking through HomeServe
            today.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Browse Services
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            {/* Brand */}
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src="/images/homeserve-logo.png"
                    alt="HomeServe"
                    fill
                    sizes="36px"
                    className="object-contain"
                  />
                </div>

                <span className="text-lg font-black tracking-tight text-[#061F35]">
                  HomeServe
                </span>
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
                Professional cleaning, moving and electrical services made
                easier through one convenient platform.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-sm font-bold text-[#061F35]">
                Explore
              </h3>

              <div className="mt-5 space-y-3">
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

            {/* Support */}
            <div>
              <h3 className="text-sm font-bold text-[#061F35]">
                Support
              </h3>

              <div className="mt-5 space-y-3">
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

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
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