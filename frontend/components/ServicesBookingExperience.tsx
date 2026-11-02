"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Menu,
  X,
} from "lucide-react";

import BookingForm from "@/components/BookingForm";
import type { Service } from "@/types/service";

type ServiceCategoryKey = "cleaning" | "moving" | "electrical";

type Props = {
  cleaningServices: Service[];
  movingServices: Service[];
  electricalServices: Service[];
};

type Accent = "blue" | "green" | "amber";

const accentStyles: Record<
  Accent,
  {
    badge: string;
    button: string;
    icon: string;
    line: string;
    heading: string;
    smallText: string;
    cardBorder: string;
    cardHover: string;
  }
> = {
  blue: {
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    button: "bg-blue-600 hover:bg-blue-500",
    icon: "bg-blue-100 text-blue-600",
    line: "bg-blue-600",
    heading: "text-blue-600",
    smallText: "text-blue-300",
    cardBorder: "hover:border-blue-300/30",
    cardHover: "hover:bg-[#10466F]",
  },
  green: {
    badge: "border-green-200 bg-green-50 text-green-700",
    button: "bg-green-600 hover:bg-green-500",
    icon: "bg-green-100 text-green-600",
    line: "bg-green-600",
    heading: "text-green-600",
    smallText: "text-green-300",
    cardBorder: "hover:border-green-300/30",
    cardHover: "hover:bg-[#10466F]",
  },
  amber: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    button: "bg-amber-500 hover:bg-amber-400",
    icon: "bg-amber-100 text-amber-600",
    line: "bg-amber-500",
    heading: "text-amber-600",
    smallText: "text-amber-300",
    cardBorder: "hover:border-amber-300/30",
    cardHover: "hover:bg-[#10466F]",
  },
};

const categoryConfig: Record<
  ServiceCategoryKey,
  {
    name: string;
    title: string;
    subtitle: string;
    description: string;
    categoryDescription: string;
    accent: Accent;
    brandLogo: string;
  }
> = {
  cleaning: {
    name: "Cleaning",
    title: "A Cleaner Home Starts Here.",
    subtitle: "Professional cleaning for homes and businesses.",
    description:
      "From everyday home cleaning to deep cleaning and post-construction cleanup, HomeServe helps keep your space fresh, healthy and comfortable.",
    categoryDescription:
      "Professional cleaning solutions designed for homes, offices and properties.",
    accent: "blue",
    brandLogo: "/images/cleaning-service.webp",
  },
  moving: {
    name: "Moving",
    title: "Move With Confidence.",
    subtitle: "Safe and reliable moving services for every journey.",
    description:
      "Whether you're moving a home, office or a single item, HomeServe helps make your relocation easier, safer and more convenient.",
    categoryDescription:
      "Reliable moving solutions designed for homes, offices and individual items.",
    accent: "green",
    brandLogo: "/images/moving-service.webp",
  },
  electrical: {
    name: "Electrical",
    title: "Powering Your Home Safely.",
    subtitle: "Professional electrical installation, repair and inspection.",
    description:
      "From sockets and lighting to wiring, fault diagnosis and electrical repairs, HomeServe provides reliable electrical solutions for homes and businesses.",
    categoryDescription:
      "Professional electrical solutions for installation, repairs, diagnosis and inspections.",
    accent: "amber",
    brandLogo: "/images/electrical-service.webp",
  },
};

const categoryOrder: ServiceCategoryKey[] = [
  "cleaning",
  "moving",
  "electrical",
];

const navigation = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function ServicesBookingExperience({
  cleaningServices,
  movingServices,
  electricalServices,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedServiceId, setSelectedServiceId] =
    useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const servicesByCategory = useMemo(
    () => ({
      cleaning: cleaningServices,
      moving: movingServices,
      electrical: electricalServices,
    }),
    [cleaningServices, movingServices, electricalServices]
  );

  const allServices = useMemo(
    () => [
      ...cleaningServices,
      ...movingServices,
      ...electricalServices,
    ],
    [cleaningServices, movingServices, electricalServices]
  );

  const selectedService = allServices.find(
    (service) => service.id === selectedServiceId
  );

  const selectedCategory = selectedService
    ? (selectedService.category.toLowerCase() as ServiceCategoryKey)
    : null;

  // Restore a selected service from the URL.
  // This is important when returning from the address page
  // or after logging in.
  useEffect(() => {
    const serviceId = searchParams.get("service");

    if (!serviceId) {
      setSelectedServiceId(null);
      return;
    }

    const serviceExists = allServices.some(
      (service) => service.id === serviceId
    );

    if (serviceExists) {
      setSelectedServiceId(serviceId);
    }
  }, [searchParams, allServices]);

  function selectService(service: Service) {
    setSelectedServiceId(service.id);
    setSidebarOpen(false);

    router.replace(
      `/services?service=${encodeURIComponent(service.id)}`,
      { scroll: false }
    );

    window.setTimeout(() => {
      document
        .getElementById("booking-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  function changeService() {
    setSelectedServiceId(null);
    setSidebarOpen(false);

    router.replace("/services", { scroll: false });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const returnTo = selectedService
    ? `/services?service=${encodeURIComponent(selectedService.id)}`
    : "/services";

  return (
    <main className="min-h-screen bg-[#061F35] text-white">
      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2.5"
          >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl sm:h-12 sm:w-12">
              <Image
                src="/images/homeserve-logo.webp"
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

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#061F35] transition hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              href="/bookings"
              className="rounded-xl bg-[#082B49] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0B3A61]"
            >
              My Bookings
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-[#061F35] transition hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-[60] bg-[#061F35]/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed right-0 top-0 z-[70]
          h-screen w-[min(88vw,360px)]
          bg-white text-[#061F35] shadow-2xl
          transition-transform duration-300 lg:hidden
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-5">
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-xl">
              <Image
                src="/images/homeserve-logo.webp"
                alt="HomeServe"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>

            <span className="text-base font-black">
              HomeServe
            </span>
          </Link>

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setSidebarOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(100vh-72px)] flex-col overflow-y-auto px-5 py-6">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-[#082B49]"
              >
                {item.label}
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </Link>
            ))}
          </nav>

          <div className="my-6 h-px bg-slate-200" />

          <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Our Services
          </p>

          <div className="space-y-1">
            {categoryOrder.map((category) => (
              <a
                key={category}
                href={`#${category}`}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                {categoryConfig[category].name}
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </a>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <Link
              href="/login"
              onClick={() => setSidebarOpen(false)}
              className="block rounded-xl border border-slate-200 px-5 py-3.5 text-center text-sm font-bold text-[#061F35] transition hover:bg-slate-50"
            >
              Login
            </Link>

            <Link
              href="/bookings"
              onClick={() => setSidebarOpen(false)}
              className="mt-3 block rounded-xl bg-[#082B49] px-5 py-3.5 text-center text-sm font-bold text-white transition hover:bg-[#0B3A61]"
            >
              My Bookings
            </Link>
          </div>
        </div>
      </aside>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <div className="pt-[72px]">
        {selectedService && selectedCategory ? (
          <section
            id="booking-section"
            className="scroll-mt-20 bg-[#061F35] px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
          >
            <div className="mx-auto max-w-5xl">
              <button
                type="button"
                onClick={changeService}
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-200 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all services
              </button>

              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                    HomeServe / {categoryConfig[selectedCategory].name}
                  </p>

                  <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                    {selectedService.name}
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                    Complete the details below to arrange your service.
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full border px-4 py-2 text-xs font-bold ${
                    accentStyles[
                      categoryConfig[selectedCategory].accent
                    ].badge
                  }`}
                >
                  {categoryConfig[selectedCategory].name}
                </span>
              </div>

              <BookingForm
                key={selectedService.id}
                category={selectedCategory}
                service={selectedService}
                returnTo={returnTo}
              />
            </div>
          </section>
        ) : (
          <>
            {/* =====================================================
                SERVICE CATEGORIES
            ===================================================== */}

            <section
              id="service-categories"
              className="bg-[#082B49] px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16"
            >
              <div className="mx-auto max-w-7xl">
                <div className="space-y-14 sm:space-y-16">
                  {categoryOrder.map((category) => {
                    const config = categoryConfig[category];
                    const styles = accentStyles[config.accent];
                    const services = servicesByCategory[category];

                    return (
                      <section
                        key={category}
                        id={category}
                        className="scroll-mt-28"
                      >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <div
                              className={`mb-3 inline-flex rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${styles.badge}`}
                            >
                              HomeServe • {config.name}
                            </div>

                            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                              {config.title}
                            </h1>

                            <p
                              className={`mt-3 text-base font-semibold sm:text-lg ${styles.heading}`}
                            >
                              {config.subtitle}
                            </p>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                              {config.description}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-slate-300">
                              {services.length}{" "}
                              {services.length === 1
                                ? "service"
                                : "services"}
                            </span>
                          </div>
                        </div>

                        {services.length > 0 ? (
                          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                            {services.map((service) => (
                              <ServiceCard
                                key={service.id}
                                service={service}
                                category={category}
                                categoryName={config.name}
                                accent={config.accent}
                                brandLogo={config.brandLogo}
                                onSelect={selectService}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="mt-8 rounded-2xl border border-white/10 bg-[#0B3A61] p-6 text-center">
                            <p className="text-sm font-semibold text-white">
                              No {config.name.toLowerCase()} services are currently available.
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                              Please check back later.
                            </p>
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="bg-[#061F35] text-white">
              <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
                <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-sm">
                    <Link
                      href="/"
                      className="flex items-center gap-3"
                    >
                      <div className="relative h-11 w-11 overflow-hidden rounded-xl">
                        <Image
                          src="/images/homeserve-logo.webp"
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

                  <div>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                      Explore
                    </p>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                      {navigation.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="text-slate-300 transition hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}

                      <Link
                        href="/login"
                        className="text-slate-300 transition hover:text-white"
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                </div>

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
          </>
        )}
      </div>
    </main>
  );
}

/* ============================================================
   SERVICE CARD
   Adapted from the uploaded ServiceCategoryPage design.
============================================================ */

function ServiceCard({
  service,
  category,
  categoryName,
  accent,
  brandLogo,
  onSelect,
}: {
  service: Service;
  category: ServiceCategoryKey;
  categoryName: string;
  accent: Accent;
  brandLogo: string;
  onSelect: (service: Service) => void;
}) {
  const styles = accentStyles[accent];

  const requiresQuote = service.pricingType === "QUOTE";

  const hours = service.duration
    ? Math.round(service.duration / 60)
    : null;

  const pricingLabel = requiresQuote
    ? "Quote"
    : service.pricingType === "FIXED"
      ? "Fixed Price"
      : "Calculated";

  return (
    <article
      className={`
        group relative flex min-w-0 flex-col overflow-hidden
        rounded-2xl border border-blue-200/10
        bg-[#0B3A61] p-3.5
        transition duration-300
        hover:-translate-y-1
        sm:p-5
        ${styles.cardBorder}
        ${styles.cardHover}
      `}
    >
      {/* Category accent line */}
      <div
        className={`absolute left-0 right-0 top-0 h-1 ${styles.line}`}
      />

      {/* Branding and pricing */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1 sm:h-14 sm:w-14 sm:rounded-xl sm:p-1.5">
          <Image
            src={brandLogo}
            alt={`HomeServe ${categoryName}`}
            width={56}
            height={56}
            className="h-full w-full object-contain"
          />
        </div>

        <span className="rounded-full bg-white/10 px-2 py-1 text-[9px] font-semibold text-slate-300 sm:px-3 sm:text-[11px]">
          {pricingLabel}
        </span>
      </div>

      {/* Service name */}
      <h3 className="mt-4 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-white sm:mt-5 sm:min-h-0 sm:text-lg sm:leading-6">
        {service.name}
      </h3>

      {/* Description */}
      <p className="mt-2 line-clamp-3 min-h-[60px] text-[11px] leading-5 text-slate-300 sm:min-h-[48px] sm:text-sm sm:leading-6">
        {service.description || "Professional HomeServe service."}
      </p>

      {/* Service information */}
      <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
        <span className="flex min-w-0 items-center gap-1.5 text-[10px] text-slate-400 sm:text-xs">
          <Clock3 className="h-3.5 w-3.5 shrink-0" />

          <span className="truncate">
            {hours
              ? `Approx. ${hours} ${hours === 1 ? "hour" : "hours"}`
              : "Duration varies"}
          </span>
        </span>

        <span
          className={`shrink-0 text-[10px] font-semibold sm:text-xs ${styles.smallText}`}
        >
          HomeServe
        </span>
      </div>

      {/* Select service */}
      <button
        type="button"
        onClick={() => onSelect(service)}
        className={`
          mt-4 flex w-full items-center justify-center gap-1.5
          rounded-xl px-2 py-3
          text-center text-[10px] font-bold text-white
          transition sm:mt-5 sm:gap-2 sm:px-4 sm:text-sm
          ${styles.button}
        `}
      >
        <span className="truncate">
          {requiresQuote ? "Request a Quote" : "Book This Service"}
        </span>

        <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
      </button>
    </article>
  );
}