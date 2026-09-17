import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
      <Navbar />
{/* HERO */}
<section className="relative overflow-hidden bg-white">
  {/* Background logo */}
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
      backgroundImage:
        "url('/images/image.png')",
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
      {/* Small brand label */}
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

      {/* Supporting text */}
      <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
        <span>✓ Trusted Professionals</span>
        <span>✓ Convenient Scheduling</span>
        <span>✓ Reliable Service</span>
      </div>
    </div>
  </div>
</section>

      <Footer />
    </main>
  );
}

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