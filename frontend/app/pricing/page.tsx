import Link from "next/link";

const categories = [
  {
    name: "Cleaning",
    description:
      "Professional cleaning services for homes and spaces of different sizes.",
    color: "blue",
    href: "/services/cleaning",
    pricing: "Calculated pricing",
    details: [
      "Pricing can depend on the selected cleaning service.",
      "Property size and service requirements can affect the price.",
      "The booking form calculates the applicable amount from the configured pricing rules.",
    ],
  },
  {
    name: "Moving",
    description:
      "Moving and relocation services for customers who need help transporting their belongings.",
    color: "green",
    href: "/services/moving",
    pricing: "Quote-based pricing",
    details: [
      "Moving requirements can vary significantly between customers.",
      "The final cost may depend on the move details and service requirements.",
      "A quote can be requested when an exact price cannot be determined immediately.",
    ],
  },
  {
    name: "Electrical",
    description:
      "Professional electrical installation, maintenance and repair services.",
    color: "amber",
    href: "/services/electrical",
    pricing: "Instant or quote",
    details: [
      "Some electrical services have defined pricing.",
      "More complex electrical work may require additional assessment.",
      "Where a fixed price is not appropriate, HomeServe can provide a quote.",
    ],
  },
];

const pricingPrinciples = [
  {
    number: "01",
    title: "Service selection",
    description:
      "The service you select determines the pricing rules that apply to your booking.",
  },
  {
    number: "02",
    title: "Service requirements",
    description:
      "Additional information such as size, quantity or job requirements may affect the calculated price.",
  },
  {
    number: "03",
    title: "Pricing rules",
    description:
      "HomeServe uses configured pricing rules to determine the applicable amount for services that support calculated pricing.",
  },
  {
    number: "04",
    title: "Quote when necessary",
    description:
      "When a service cannot reasonably be priced from predefined information, the booking can go through a quote process.",
  },
];

const faqItems = [
  {
    question: "Are all HomeServe services fixed-price?",
    answer:
      "No. Some services can use fixed or calculated pricing, while others may require a quote depending on the service requirements.",
  },
  {
    question: "Why do some services require a quote?",
    answer:
      "Certain jobs can vary considerably depending on the customer's requirements. A quote allows the service to be assessed before a final amount is agreed.",
  },
  {
    question: "Can the price change after I provide more information?",
    answer:
      "For calculated services, the amount is determined from the information supplied during booking and the pricing rules configured for that service. Quote-based services are priced through the quote process.",
  },
  {
    question: "Where can I see the price for my booking?",
    answer:
      "When the service supports immediate pricing, the applicable amount is calculated during the booking process. For quote-based services, the quote is made available through the HomeServe booking and quote workflow.",
  },
];

function getCategoryStyles(color: string) {
  switch (color) {
    case "blue":
      return {
        badge: "bg-blue-50 text-blue-700",
        border: "border-blue-200",
        button:
          "bg-blue-600 hover:bg-blue-700",
        number: "text-blue-600",
      };

    case "green":
      return {
        badge: "bg-green-50 text-green-700",
        border: "border-green-200",
        button:
          "bg-green-600 hover:bg-green-700",
        number: "text-green-600",
      };

    case "amber":
      return {
        badge: "bg-amber-50 text-amber-700",
        border: "border-amber-200",
        button:
          "bg-amber-500 hover:bg-amber-600",
        number: "text-amber-600",
      };

    default:
      return {
        badge: "bg-slate-50 text-slate-700",
        border: "border-slate-200",
        button:
          "bg-[#061F35] hover:bg-[#082B49]",
        number: "text-[#061F35]",
      };
  }
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-[#061F35]">

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <Link
            href="/"
            className="flex items-center gap-3"
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
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              About
            </Link>

            <Link
              href="/pricing"
              className="text-sm font-semibold text-[#061F35]"
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
          INTRO
      ===================================================== */}

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">

          <div className="max-w-3xl">

            <p className="text-sm font-bold text-blue-600">
              HomeServe Pricing
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#061F35] sm:text-5xl">
              Clear pricing for the service you need.
            </h1>

            <p className="mt-5 text-base leading-8 text-slate-600">
              HomeServe uses different pricing approaches
              depending on the type of service and the information
              required to determine its cost.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              Some services can be calculated immediately from
              predefined pricing rules, while other jobs require
              a quote before the final amount is determined.
            </p>

          </div>

        </div>
      </section>

      {/* =====================================================
          PRICING MODEL
      ===================================================== */}

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">
            <p className="text-sm font-bold text-blue-600">
              How pricing works
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#061F35] sm:text-4xl">
              Pricing depends on the service requirements
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              HomeServe does not use one pricing formula for every
              service. The system applies the pricing method
              appropriate for the service being requested.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {pricingPrinciples.map((item) => (
              <div
                key={item.number}
                className="border-t-2 border-slate-200 pt-5"
              >
                <span className="text-sm font-black text-blue-600">
                  {item.number}
                </span>

                <h3 className="mt-4 text-lg font-bold text-[#061F35]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          SERVICE CATEGORIES
      ===================================================== */}

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">
            <p className="text-sm font-bold text-blue-600">
              Service categories
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#061F35] sm:text-4xl">
              How pricing works across HomeServe
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">

            {categories.map((category) => {
              const styles =
                getCategoryStyles(
                  category.color
                );

              return (
                <div
                  key={category.name}
                  className={`rounded-2xl border bg-white p-7 ${styles.border}`}
                >

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${styles.badge}`}
                  >
                    {category.pricing}
                  </span>

                  <h3 className="mt-5 text-2xl font-black text-[#061F35]">
                    {category.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {category.description}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                    {category.details.map(
                      (detail) => (
                        <div
                          key={detail}
                          className="flex gap-3"
                        >
                          <span className="mt-0.5 text-sm font-bold text-slate-400">
                            ✓
                          </span>

                          <p className="text-sm leading-6 text-slate-600">
                            {detail}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  <Link
                    href={category.href}
                    className={`mt-7 inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-bold text-white transition ${styles.button}`}
                  >
                    Explore {category.name}
                    <span className="ml-2">
                      →
                    </span>
                  </Link>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* =====================================================
          IMPORTANT NOTE
      ===================================================== */}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">

            <div className="flex gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                i
              </div>

              <div>
                <h2 className="font-bold text-[#061F35]">
                  About the price you see
                </h2>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  The amount associated with your booking is
                  determined according to the pricing method
                  applicable to the selected service and the
                  information provided during booking.
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  For quote-based services, the displayed
                  booking information does not represent a final
                  price until the quote has been prepared and
                  provided through the HomeServe quote process.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="border-t border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">

          <div className="text-center">
            <p className="text-sm font-bold text-blue-600">
              Pricing questions
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#061F35] sm:text-4xl">
              Common questions about pricing
            </h2>
          </div>

          <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">

            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-[#061F35]">
                  <span>
                    {item.question}
                  </span>

                  <span className="text-xl text-slate-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
                  {item.answer}
                </p>
              </details>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-slate-200 pt-10 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-2xl font-black text-[#061F35]">
              Ready to request a service?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose a service and see the applicable pricing
              during the booking process.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex w-fit rounded-lg bg-[#061F35] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#082B49]"
          >
            Browse Services
            <span className="ml-2">
              →
            </span>
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
                href="/about"
                className="hover:text-blue-600"
              >
                About
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