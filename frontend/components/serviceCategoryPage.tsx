"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
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

const navigation = [
  {
    label: "Services",
    href: "/services",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const styles = accentStyles[accent];

  const categoryName = categoryNames[category];

  const categoryDescription =
    categoryDescriptions[category];

  return (
    <main className="min-h-screen bg-[#061F35] text-white">
      {/* =====================================================
          FIXED TOP BAR
      ===================================================== */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* BRAND */}
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
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

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-slate-600 transition hover:text-[#082B49]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#061F35] transition hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              href={`/book/${category}`}
              className="rounded-xl bg-[#082B49] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0B3A61]"
            >
              Book a Service
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              border border-slate-200
              text-[#061F35]
              transition
              hover:bg-slate-100
              lg:hidden
            "
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* =====================================================
          MOBILE SIDEBAR BACKDROP
      ===================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          className="
            fixed inset-0 z-[60]
            bg-[#061F35]/50
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed right-0 top-0 z-[70]
          h-screen w-[min(88vw,360px)]
          bg-white
          text-[#061F35]
          shadow-2xl
          transition-transform duration-300
          lg:hidden
          ${
            sidebarOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* Sidebar header */}
        <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-5">
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-xl">
              <Image
                src="/images/homeserve-logo.png"
                alt="HomeServe"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-[16px] font-black tracking-tight">
                HomeServe
              </p>

              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Professional Services
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setSidebarOpen(false)}
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              border border-slate-200
              text-slate-600
              transition
              hover:bg-slate-100
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex h-[calc(100vh-72px)] flex-col overflow-y-auto px-5 py-6">
          {/* Navigation */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const active =
                item.href === "/services" ||
                item.href === `/services/${category}`;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center justify-between
                    rounded-xl
                    px-4 py-3.5
                    text-sm font-bold
                    transition
                    ${
                      active
                        ? "bg-blue-50 text-[#082B49]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#082B49]"
                    }
                  `}
                >
                  <span>{item.label}</span>

                  <ChevronRight
                    className={`
                      h-4 w-4
                      ${
                        active
                          ? "text-blue-600"
                          : "text-slate-300"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-6 h-px bg-slate-200" />

          {/* Category section */}
          <div>
            <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Our Services
            </p>

            <div className="space-y-1">
              <Link
                href="/services/cleaning"
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition
                  ${
                    category === "cleaning"
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }
                `}
              >
                Cleaning
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </Link>

              <Link
                href="/services/moving"
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition
                  ${
                    category === "moving"
                      ? "bg-green-50 text-green-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }
                `}
              >
                Moving
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </Link>

              <Link
                href="/services/electrical"
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition
                  ${
                    category === "electrical"
                      ? "bg-amber-50 text-amber-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }
                `}
              >
                Electrical
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </Link>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="mt-auto pt-8">
            <Link
              href="/login"
              onClick={() => setSidebarOpen(false)}
              className="
                block rounded-xl
                border border-slate-200
                px-5 py-3.5
                text-center
                text-sm font-bold
                text-[#061F35]
                transition
                hover:bg-slate-50
              "
            >
              Login
            </Link>

            <Link
              href={`/book/${category}`}
              onClick={() => setSidebarOpen(false)}
              className="
                mt-3 block rounded-xl
                bg-[#082B49]
                px-5 py-3.5
                text-center
                text-sm font-bold
                text-white
                transition
                hover:bg-[#0B3A61]
              "
            >
              Book a Service
            </Link>
          </div>
        </div>
      </aside>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <div className="pt-[72px]">
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
                className={`
                  mb-5 inline-flex rounded-full border
                  px-4 py-2
                  text-xs font-bold
                  uppercase tracking-[0.2em]
                  ${styles.badge}
                `}
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
                className={`
                  mt-5
                  text-lg font-semibold
                  leading-7
                  sm:text-xl
                  ${styles.heading}
                `}
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
                  className={`
                    rounded-xl
                    px-6 py-3.5
                    text-center
                    text-sm font-bold
                    text-white
                    transition
                    ${styles.button}
                  `}
                >
                  {`Explore ${categoryName} Services →`}
                </Link>

                <Link
                  href={`/book/${category}`}
                  className={`
                    rounded-xl
                    border
                    px-6 py-3.5
                    text-center
                    text-sm font-bold
                    transition
                    ${styles.outlineButton}
                  `}
                >
                  Book a Service
                </Link>
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
                  className={`
                    text-xs font-bold
                    uppercase tracking-[0.3em]
                    ${styles.smallText}
                  `}
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

        <footer className="bg-[#061F35] text-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
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
                  Reliable cleaning, moving and electrical
                  services delivered by trusted professionals
                  across Kenya.
                </p>
              </div>

              {/* Explore */}
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

            {/* Footer bottom */}
            <div className="mt-10 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  © {new Date().getFullYear()} HomeServe.
                  All rights reserved.
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
          mt-5 flex
          items-center
          justify-center
          gap-2
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
          ? "Request a Quote"
          : "Book This Service"}

        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}