import Link from "next/link";

const workflow = [
  {
    number: "01",
    title: "You request a service",
    description:
      "Choose cleaning, moving or electrical services, provide the required details, select your address and preferred schedule, then submit your booking.",
  },
  {
    number: "02",
    title: "HomeServe receives your request",
    description:
      "Your booking is recorded in the HomeServe system. Depending on the service, the price may be calculated immediately or the booking may require a quote.",
  },
  {
    number: "03",
    title: "Our team reviews the booking",
    description:
      "An administrator reviews the request, service requirements, schedule and other relevant information before assigning the job.",
  },
  {
    number: "04",
    title: "A staff member is assigned",
    description:
      "The administrator assigns an appropriate staff member based on the service requirements, qualifications and availability.",
  },
  {
    number: "05",
    title: "The service is carried out",
    description:
      "The assigned staff member attends the service location and carries out the requested work.",
  },
  {
    number: "06",
    title: "You receive updates",
    description:
      "HomeServe keeps you informed as important stages of your booking are reached.",
  },
  {
    number: "07",
    title: "The job is completed",
    description:
      "Once the requested work has been completed, the booking is marked as completed and the customer receives a completion update.",
  },
];

const customerUpdates = [
  {
    label: "Booking received",
    description:
      "Confirmation that your service request has been received.",
  },
  {
    label: "Quote sent",
    description:
      "For quote-based services, notification when a quote is available.",
  },
  {
    label: "Staff assigned",
    description:
      "Notification when a HomeServe staff member has been assigned.",
  },
  {
    label: "Service started",
    description:
      "An update when the assigned staff member begins the job.",
  },
  {
    label: "Service completed",
    description:
      "Confirmation when the requested service has been completed.",
  },
  {
    label: "Booking cancelled",
    description:
      "An update if a booking is cancelled.",
  },
];

const problems = [
  {
    title: "Disconnected communication",
    description:
      "Service requests can become difficult to follow when customers, administrators and staff communicate through separate channels.",
  },
  {
    title: "Unclear service progress",
    description:
      "Customers may not know whether a booking has been received, assigned, started or completed.",
  },
  {
    title: "Manual staff coordination",
    description:
      "Administrators need a structured way to match bookings with available staff members.",
  },
  {
    title: "Different pricing requirements",
    description:
      "Some services can use predefined pricing while others require a quote before the customer proceeds.",
  },
  {
    title: "Scattered customer information",
    description:
      "Addresses, bookings and service information are easier to manage when they are connected to one customer account.",
  },
  {
    title: "Limited operational visibility",
    description:
      "A service business needs visibility into customers, bookings, staff, payments, quotes and other operational activities.",
  },
];

const roles = [
  {
    number: "01",
    title: "Customer",
    description:
      "The customer chooses a service, provides the required information, manages addresses and bookings, receives notifications and follows the progress of the service.",
  },
  {
    number: "02",
    title: "Administrator",
    description:
      "Administrators manage bookings, customers, staff assignments, pricing, quotes, payments and other operational activities.",
  },
  {
    number: "03",
    title: "Staff",
    description:
      "Staff members receive assigned jobs, manage their assignments and update the progress of the services they carry out.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#061F35]">

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Simple logo - intentionally no shadow */}
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#061F35] text-lg font-black text-white">
              H
            </div>

            <div>
              <p className="text-lg font-black tracking-tight text-[#061F35]">
                HomeServe
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
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
              className="text-sm font-semibold text-[#061F35]"
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

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:block"
            >
              Login
            </Link>

            <Link
              href="/services"
              className="rounded-lg bg-[#061F35] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#082B49]"
            >
              Book a Service
            </Link>
          </div>

        </div>
      </header>

      {/* =====================================================
          PAGE INTRO
      ===================================================== */}

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

          <div className="max-w-4xl">
            <p className="text-sm font-bold text-blue-600">
              About HomeServe
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#061F35] sm:text-5xl">
              A service platform built around the entire customer journey.
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              HomeServe is designed to connect customers,
              administrators and service staff through one
              structured service workflow.
            </p>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
              Instead of treating a booking as a single request,
              HomeServe manages the journey from the moment a
              customer requests a service to the moment that
              service is completed.
            </p>
          </div>

          {/* Small page facts */}
          <div className="mt-12 grid max-w-4xl border-y border-slate-200 sm:grid-cols-3">

            <div className="border-b border-slate-200 py-5 sm:border-b-0 sm:border-r sm:pr-6">
              <p className="text-2xl font-black text-[#061F35]">
                3
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Core service categories
              </p>
            </div>

            <div className="border-b border-slate-200 py-5 sm:border-b-0 sm:border-r sm:px-6">
              <p className="text-2xl font-black text-[#061F35]">
                3
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Main user roles
              </p>
            </div>

            <div className="py-5 sm:pl-6">
              <p className="text-2xl font-black text-[#061F35]">
                1
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Connected service workflow
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          WHY WE BUILT IT
      ===================================================== */}

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

            <div>
              <p className="text-sm font-bold text-blue-600">
                Why HomeServe exists
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#061F35] sm:text-4xl">
                Solving the coordination problem
              </h2>
            </div>

            <div className="space-y-5 text-sm leading-7 text-slate-600 sm:text-base">
              <p>
                Requesting a professional service involves more
                than simply choosing a service and selecting a
                date. Someone has to receive the request, review
                the requirements, determine the appropriate price
                or quote, coordinate staff and keep the customer
                informed.
              </p>

              <p>
                When these activities are handled through
                disconnected conversations and manual processes,
                important information can become difficult to
                track.
              </p>

              <p>
                HomeServe brings these activities into one
                platform so that each participant has a clear
                place in the service workflow.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          PROBLEMS
      ===================================================== */}

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">
            <p className="text-sm font-bold text-blue-600">
              The problems we are addressing
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#061F35] sm:text-4xl">
              Turning fragmented processes into one workflow
            </h2>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-3">

            {problems.map((problem, index) => (
              <div
                key={problem.title}
                className="bg-white p-7"
              >
                <span className="text-sm font-black text-blue-600">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-5 text-lg font-bold text-[#061F35]">
                  {problem.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {problem.description}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS - TIMELINE
      ===================================================== */}

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">

          <div className="max-w-3xl">
            <p className="text-sm font-bold text-blue-600">
              The HomeServe workflow
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#061F35] sm:text-4xl">
              What happens after you book?
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              A HomeServe booking moves through several stages.
              Each stage has a specific purpose and contributes
              to keeping the service organized.
            </p>
          </div>

          <div className="relative mt-12">

            {/* Timeline line */}
            <div className="absolute bottom-0 left-[19px] top-0 hidden w-px bg-slate-200 sm:block" />

            <div className="space-y-8">

              {workflow.map((step) => (
                <div
                  key={step.number}
                  className="relative flex gap-6"
                >

                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#061F35] text-[11px] font-black text-white">
                    {step.number}
                  </div>

                  <div className="flex-1 border-b border-slate-200 pb-8">
                    <h3 className="text-xl font-bold text-[#061F35]">
                      {step.title}
                    </h3>

                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
                      {step.description}
                    </p>
                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          CUSTOMER NOTIFICATIONS
      ===================================================== */}

      <section className="bg-[#061F35] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">

            <div>
              <p className="text-sm font-bold text-blue-300">
                Customer communication
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                You should know what is happening with your booking.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
                HomeServe is designed to provide updates at
                important points in the service lifecycle.
                Depending on the event and configured delivery
                channels, notifications can appear in your
                HomeServe account and may also be delivered by
                email or SMS.
              </p>
            </div>

            <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">

              {customerUpdates.map(
                (update, index) => (
                  <div
                    key={update.label}
                    className="flex gap-5 p-5 sm:p-6"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-black text-blue-300">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="font-bold text-white">
                        {update.label}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {update.description}
                      </p>
                    </div>
                  </div>
                )
              )}

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          USER ROLES
      ===================================================== */}

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">
            <p className="text-sm font-bold text-blue-600">
              The people behind each booking
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#061F35] sm:text-4xl">
              Three roles, one connected system
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              HomeServe provides different tools depending on
              the role of the person using the platform.
            </p>
          </div>

          <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">

            {roles.map((role) => (
              <div
                key={role.number}
                className="grid gap-4 py-8 sm:grid-cols-[80px_220px_1fr] sm:items-start"
              >

                <span className="text-sm font-black text-blue-600">
                  {role.number}
                </span>

                <h3 className="text-xl font-bold text-[#061F35]">
                  {role.title}
                </h3>

                <p className="text-sm leading-7 text-slate-500 sm:text-base">
                  {role.description}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          PRINCIPLES
      ===================================================== */}

      <section className="border-t border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="text-sm font-bold text-[#061F35]">
                Simple
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                The booking experience should be understandable
                from beginning to end.
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-[#061F35]">
                Organized
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Service information should remain connected
                throughout the booking lifecycle.
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-[#061F35]">
                Connected
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Customers, administrators and staff should work
                from the same operational workflow.
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-[#061F35]">
                Transparent
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Customers should receive meaningful updates as
                their service progresses.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          SIMPLE END CTA
      ===================================================== */}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border-t border-slate-200 pt-10 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-2xl font-black text-[#061F35]">
              Explore HomeServe
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              See the services available on the platform.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex rounded-lg bg-[#061F35] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#082B49]"
          >
            Explore Services
            <span className="ml-2">→</span>
          </Link>

        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#061F35] text-sm font-black text-white">
                H
              </div>

              <span className="font-black text-[#061F35]">
                HomeServe
              </span>
            </Link>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <Link
                href="/services"
                className="hover:text-blue-600"
              >
                Services
              </Link>

              <Link
                href="/pricing"
                className="hover:text-blue-600"
              >
                Pricing
              </Link>

              <Link
                href="/faq"
                className="hover:text-blue-600"
              >
                FAQ
              </Link>

              <Link
                href="/contact"
                className="hover:text-blue-600"
              >
                Contact
              </Link>
            </div>

          </div>

          <div className="mt-6 border-t border-slate-100 pt-5 text-xs text-slate-400">
            © {new Date().getFullYear()} HomeServe. All rights reserved.
          </div>

        </div>
      </footer>

    </main>
  );
}