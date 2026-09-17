import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#082B49] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/">
              <img
                src="/images/image.png"
                alt="HomeServe"
                className="w-44 brightness-0 invert"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              Professional cleaning, moving and electrical
              services for modern Kenyan homes and
              businesses.
            </p>

            <p className="mt-4 text-sm font-medium text-amber-300">
              A brighter, easier home.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Services
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                href="/services/cleaning"
                className="block text-sm text-slate-300 transition hover:text-amber-300"
              >
                Cleaning
              </Link>

              <Link
                href="/services/moving"
                className="block text-sm text-slate-300 transition hover:text-amber-300"
              >
                Moving
              </Link>

              <Link
                href="/services/electrical"
                className="block text-sm text-slate-300 transition hover:text-amber-300"
              >
                Electrical
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Company
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                href="/about"
                className="block text-sm text-slate-300 transition hover:text-amber-300"
              >
                About Us
              </Link>

              <Link
                href="/pricing"
                className="block text-sm text-slate-300 transition hover:text-amber-300"
              >
                Pricing
              </Link>

              <Link
                href="/faq"
                className="block text-sm text-slate-300 transition hover:text-amber-300"
              >
                FAQ
              </Link>

              <Link
                href="/contact"
                className="block text-sm text-slate-300 transition hover:text-amber-300"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} HomeServe.
              All rights reserved.
            </p>

            <p>
              Trusted professionals. Reliable service.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}