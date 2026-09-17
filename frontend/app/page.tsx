import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Professional Cleaning",
    description:
      "Keep your home or workspace clean with reliable professional cleaning services.",
    href: "/services/cleaning",
    image: "/images/cleaning-service.jpg",
    accent: "blue",
  },
  {
    title: "Moving Services",
    description:
      "Make your move easier with dependable moving and relocation assistance.",
    href: "/services/moving",
    image: "/images/moving-service.jpg",
    accent: "green",
  },
  {
    title: "Electrical Services",
    description:
      "Get professional electrical installation, maintenance and repair services.",
    href: "/services/electrical",
    image: "/images/electrical-service.jpg",
    accent: "amber",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#061F35]">

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#061F35] text-lg font-black text-white">
                H
              </div>

              <div>
                <p className="text-lg font-black tracking-tight text-[#061F35]">
                  HomeServe
                </p>

                <p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">
                  Professional Services
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop navigation */}
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

          {/* Auth actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:block"
            >
              Login
            </Link>

            <Link
              href="/services"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:px-5"
            >
              Book a Service
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#061F35]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.25),transparent_40%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">

          {/* Hero content */}
          <div className="max-w-2xl">

            <div className="mb-6 inline-flex items-center rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2">
              <span className="mr-2 h-2 w-2 rounded-full bg-blue-400" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                Professional services made simple
              </span>
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Reliable services,
              <span className="block text-blue-400">
                right where you need them.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              HomeServe connects you with professional service
              providers for cleaning, moving and electrical
              services. Book the service you need and manage
              everything from one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500"
              >
                Explore Services
                <span className="ml-2">→</span>
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Create an Account
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-xl font-black text-white">
                  3
                </p>

                <p className="text-xs text-slate-400">
                  Service categories
                </p>
              </div>

              <div>
                <p className="text-xl font-black text-white">
                  Simple
                </p>

                <p className="text-xs text-slate-400">
                  Online booking
                </p>
              </div>

              <div>
                <p className="text-xl font-black text-white">
                  24/7
                </p>

                <p className="text-xs text-slate-400">
                  Booking access
                </p>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative lg:pl-8">

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl">

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-800">

                <Image
                  src="/images/homeserve-bg.jpg"
                  alt="HomeServe professional services"
                  fill
                  priority
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#061F35]/80 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-[#061F35]/85 p-5 backdrop-blur">

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                    HomeServe
                  </p>

                  <p className="mt-2 text-lg font-bold text-white">
                    One platform. Multiple professional services.
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    Book, manage and track your services online.
                  </p>

                </div>
              </div>
            </div>

            {/* Decorative card */}
            <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-lg text-green-600">
                  ✓
                </div>

                <div>
                  <p className="text-xs font-bold text-[#061F35]">
                    Easy booking
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    From request to service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
              Our Services
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#061F35] sm:text-4xl">
              Services for your everyday needs
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              From keeping your space clean to moving into a
              new home or solving an electrical problem, HomeServe
              brings professional services together in one platform.
            </p>

          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >

                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">

                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                </div>

                <div className="p-6">

                  <h3 className="text-xl font-bold text-[#061F35]">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-5 flex items-center text-sm font-bold text-blue-600">
                    Explore service
                    <span className="ml-2 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                </div>
              </Link>
            ))}

          </div>

          <div className="mt-8 text-center">
            <Link
              href="/services"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
            >
              View all services
              <span className="ml-2">→</span>
            </Link>
          </div>

        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#061F35] sm:text-4xl">
              Getting a service is simple
            </h2>

          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Choose a service",
                description:
                  "Select the service that matches what you need and explore the available options.",
              },
              {
                number: "02",
                title: "Make a booking",
                description:
                  "Provide your service details, location and preferred schedule through our booking flow.",
              },
              {
                number: "03",
                title: "Get the service",
                description:
                  "Track your booking and receive updates as your service moves from confirmation to completion.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-7"
              >

                <span className="text-4xl font-black text-blue-100">
                  {step.number}
                </span>

                <h3 className="mt-4 text-xl font-bold text-[#061F35]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
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

      <section className="bg-[#061F35] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">
              Why HomeServe
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              A simpler way to manage your services
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              HomeServe is designed to make requesting and
              managing professional services straightforward,
              from the first booking to the completion of the job.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            {[
              {
                title: "Convenient booking",
                description:
                  "Request services online without unnecessary back-and-forth.",
              },
              {
                title: "Clear pricing",
                description:
                  "See applicable pricing or request a quote depending on the service.",
              },
              {
                title: "Booking management",
                description:
                  "Keep track of your active and previous bookings from your account.",
              },
              {
                title: "Service updates",
                description:
                  "Receive updates as your booking progresses.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-bold text-blue-300">
                  ✓
                </div>

                <h3 className="mt-4 font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-12 text-center shadow-xl sm:px-12 sm:py-16">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-100">
            Get started
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Need a professional service?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
            Explore our services and make your booking through
            HomeServe today.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/services"
              className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Browse Services
            </Link>

            <Link
              href="/register"
              className="rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
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

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="grid gap-8 md:grid-cols-4">

            <div className="md:col-span-2">

              <Link
                href="/"
                className="inline-flex items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#061F35] text-sm font-black text-white">
                  H
                </div>

                <span className="text-lg font-black text-[#061F35]">
                  HomeServe
                </span>
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
                Professional cleaning, moving and electrical
                services made easier through one convenient platform.
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

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()} HomeServe. All rights reserved.
            </p>

            <p>
              Professional services made simple.
            </p>

          </div>

        </div>
      </footer>

    </main>
  );
}
