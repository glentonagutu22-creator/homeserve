import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Service } from "@/types/service";

interface ServiceCategoryPageProps {
  title: string;
  subtitle: string;
  description: string;
  category: "cleaning" | "moving" | "electrical";
  services: Service[];
  heroImage: string;
  accent: "blue" | "green" | "amber";
  brandLogo?: string;
}

const accentStyles = {
  blue: {
    badge:
      "border-blue-200 bg-blue-50 text-blue-700",

    button:
      "bg-blue-600 hover:bg-blue-500",

    outlineButton:
      "border-blue-200 text-blue-700 hover:bg-blue-50",

    icon:
      "bg-blue-100 text-blue-600",

    line:
      "bg-blue-600",

    heading:
      "text-blue-600",

    smallText:
      "text-blue-300",

    cardBorder:
      "hover:border-blue-300/30",

    cardHover:
      "hover:bg-[#10466F]",
  },

  green: {
    badge:
      "border-green-200 bg-green-50 text-green-700",

    button:
      "bg-green-600 hover:bg-green-500",

    outlineButton:
      "border-green-200 text-green-700 hover:bg-green-50",

    icon:
      "bg-green-100 text-green-600",

    line:
      "bg-green-600",

    heading:
      "text-green-600",

    smallText:
      "text-green-300",

    cardBorder:
      "hover:border-green-300/30",

    cardHover:
      "hover:bg-[#10466F]",
  },

  amber: {
    badge:
      "border-amber-200 bg-amber-50 text-amber-700",

    button:
      "bg-amber-500 hover:bg-amber-400",

    outlineButton:
      "border-amber-200 text-amber-700 hover:bg-amber-50",

    icon:
      "bg-amber-100 text-amber-600",

    line:
      "bg-amber-500",

    heading:
      "text-amber-600",

    smallText:
      "text-amber-300",

    cardBorder:
      "hover:border-amber-300/30",

    cardHover:
      "hover:bg-[#10466F]",
  },
};

const categoryNames = {
  cleaning: "Cleaning",
  moving: "Moving",
  electrical: "Electrical",
};

const categoryDescriptions = {
  cleaning:
    "Professional cleaning solutions designed for homes, offices and properties.",

  moving:
    "Reliable moving solutions designed for homes, offices and individual items.",

  electrical:
    "Professional electrical solutions for installation, repairs, diagnosis and inspections.",
};

export default function ServiceCategoryPage({
  title,
  subtitle,
  description,
  category,
  services,
  heroImage,
  accent,
  brandLogo,
}: ServiceCategoryPageProps) {
  const styles = accentStyles[accent];

  const categoryName =
    categoryNames[category];

  const categoryDescription =
    categoryDescriptions[category];

  return (
    <main className="min-h-screen bg-[#061F35] text-white">
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">
        {/* Desktop branding */}
        <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
          <div
            className="h-full w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${heroImage}')`,
            }}
          />
        </div>

        {/* Mobile branding */}
        <div className="relative lg:hidden">
          <div className="mx-auto h-[250px] w-full max-w-sm px-5 pt-6">
            <div
              className="h-full w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${heroImage}')`,
              }}
            />
          </div>
        </div>

        {/* Hero content */}
        <div
          className="
            relative mx-auto max-w-7xl
            px-5 pb-12 pt-8
            sm:px-8
            lg:flex lg:min-h-[600px]
            lg:items-center
            lg:px-12
            lg:py-16
          "
        >
          <div className="max-w-xl">
            {/* Category badge */}
            <div
              className={`mb-5 inline-flex rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${styles.badge}`}
            >
              HomeServe • {categoryName}
            </div>

            {/* Main heading */}
            <h1
              className="
                text-4xl font-extrabold
                leading-[1.05]
                tracking-tight
                text-[#082B49]
                sm:text-5xl
                lg:text-6xl
              "
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              className={`mt-5 text-lg font-semibold leading-7 sm:text-xl ${styles.heading}`}
            >
              {subtitle}
            </p>

            {/* Description */}
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
              {description}
            </p>

            {/* Hero actions */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#services"
                className={`rounded-xl px-6 py-3.5 text-center text-sm font-bold text-white transition ${styles.button}`}
              >
                {`Explore ${categoryName} Services →`}
              </Link>

              <Link
                href={`/book/${category}`}
                className={`rounded-xl border px-6 py-3.5 text-center text-sm font-bold transition ${styles.outlineButton}`}
              >
                Book a Service
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section
        id="services"
        className="
          bg-[#082B49]
          px-5 py-16
          sm:px-8
          lg:px-12
          lg:py-20
        "
      >
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <div
            className="
              flex flex-col gap-4
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-[0.3em] ${styles.smallText}`}
              >
                {categoryName} Services
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Choose what you need
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-400">
              {categoryDescription}
            </p>
          </div>

          {/* Service cards */}
          <div
            className="
              mt-10
              grid gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                category={category}
                categoryName={categoryName}
                accent={accent}
                brandLogo={brandLogo}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </main>
  );
}

/* ============================================================
   SERVICE CARD
============================================================ */

function ServiceCard({
  service,
  category,
  categoryName,
  accent,
  brandLogo,
}: {
  service: Service;
  category: string;
  categoryName: string;
  accent: "blue" | "green" | "amber";
  brandLogo?: string;
}) {
  const styles = accentStyles[accent];

  const requiresQuote =
    service.pricingType === "QUOTE";

  const hours = service.duration
    ? Math.round(service.duration / 60)
    : null;

  return (
    <article
      className={`
        group relative overflow-hidden
        rounded-2xl
        border border-blue-200/10
        bg-[#0B3A61]
        p-5
        transition duration-300
        hover:-translate-y-1
        ${styles.cardBorder}
        ${styles.cardHover}
      `}
    >
      {/* Accent line */}
      <div
        className={`
          absolute left-0 right-0 top-0
          h-1
          ${styles.line}
        `}
      />

      {/* Branding + pricing */}
      <div className="flex items-center justify-between gap-3">
        {brandLogo ? (
          <div
            className="
              flex h-14 w-14
              shrink-0
              items-center justify-center
              overflow-hidden
              rounded-xl
              bg-white
              p-1.5
            "
          >
            <Image
              src={brandLogo}
              alt={`HomeServe ${categoryName}`}
              width={56}
              height={56}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div
            className={`
              flex h-14 w-14
              shrink-0
              items-center justify-center
              rounded-xl
              text-xl
              ${styles.icon}
            `}
          >
            {category === "cleaning"
              ? "✦"
              : category === "moving"
                ? "↗"
                : "⚡"}
          </div>
        )}

        {/* Pricing type */}
        <span
          className="
            rounded-full
            bg-white/10
            px-3 py-1
            text-[11px]
            font-semibold
            text-slate-300
          "
        >
          {requiresQuote
            ? "Quote"
            : service.pricingType === "FIXED"
              ? "Fixed Price"
              : "Calculated"}
        </span>
      </div>

      {/* Service name */}
      <h3 className="mt-5 text-lg font-bold text-white">
        {service.name}
      </h3>

      {/* Description */}
      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-300">
        {service.description}
      </p>

      {/* Service information */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400">
          {hours
            ? `Approx. ${hours} ${
                hours === 1 ? "hour" : "hours"
              }`
            : "Duration varies"}
        </span>

        <span
          className={`text-xs font-semibold ${styles.smallText}`}
        >
          HomeServe
        </span>
      </div>

      {/* Action */}
      <Link
        href={`/book/${category}?service=${service.id}`}
        className={`
          mt-5 block
          rounded-xl
          px-4 py-3
          text-center
          text-sm font-bold
          text-white
          transition
          ${styles.button}
        `}
      >
        {requiresQuote
          ? "Request a Quote →"
          : "Book This Service →"}
      </Link>
    </article>
  );
}