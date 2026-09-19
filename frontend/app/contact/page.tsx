"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import {
  submitContactMessage,
} from "@/lib/contact";

const WHATSAPP_NUMBER = "254756685132";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response =
        await submitContactMessage({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          subject: form.subject,
          message: form.message,
        });

      setSuccess(response.message);

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function openWhatsApp() {
    const message = encodeURIComponent(
      "Hello HomeServe, I would like to get help with a service."
    );

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#061F35] text-xl font-bold text-white">
              H
            </div>

            <span className="text-xl font-bold tracking-tight text-[#061F35]">
              HomeServe
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/services"
              className="text-sm font-medium text-slate-600 transition hover:text-[#061F35]"
            >
              Services
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-slate-600 transition hover:text-[#061F35]"
            >
              About
            </Link>

            <Link
              href="/pricing"
              className="text-sm font-medium text-slate-600 transition hover:text-[#061F35]"
            >
              Pricing
            </Link>

            <Link
              href="/faq"
              className="text-sm font-medium text-slate-600 transition hover:text-[#061F35]"
            >
              FAQ
            </Link>

            <Link
              href="/contact"
              className="text-sm font-semibold text-[#061F35]"
            >
              Contact
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-[#061F35] transition hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              href="/services"
              className="rounded-lg bg-[#061F35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#082B49]"
            >
              Book a Service
            </Link>
          </div>

          <Link
            href="/services"
            className="rounded-lg bg-[#061F35] px-4 py-2.5 text-sm font-semibold text-white md:hidden"
          >
            Book
          </Link>
        </div>
      </header>

      {/* Intro */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8 lg:py-20">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Contact HomeServe
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[#061F35] sm:text-5xl">
            How can we help?
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Have a question about a service, booking, quote,
            payment, or your account? Send us a message or
            chat with HomeServe on WhatsApp.
          </p>
        </div>
      </section>

      {/* Contact content */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.65fr]">
          {/* Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#061F35]">
                Send us a message
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fill in the form and our team can review your
                inquiry.
              </p>
            </div>

            {success && (
              <div className="mb-6 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <p className="font-semibold">
                    Message sent
                  </p>

                  <p className="mt-1">
                    {success}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateField(
                        "name",
                        event.target.value
                      )
                    }
                    required
                    placeholder="Your name"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#061F35] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#061F35] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Phone
                    <span className="ml-1 font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value
                      )
                    }
                    placeholder="+254..."
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#061F35] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    type="text"
                    value={form.subject}
                    onChange={(event) =>
                      updateField(
                        "subject",
                        event.target.value
                      )
                    }
                    required
                    placeholder="How can we help?"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#061F35] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  value={form.message}
                  onChange={(event) =>
                    updateField(
                      "message",
                      event.target.value
                    )
                  }
                  required
                  rows={7}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#061F35] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#061F35] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send size={17} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact options */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#061F35]">
                Contact options
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Choose the method that works best for you.
              </p>

              <div className="mt-7 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#061F35]">
                    <Mail size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-[#061F35]">
                      Email
                    </p>

                    <a
                      href="mailto:support@homeserve.co.ke"
                      className="mt-1 block text-sm text-slate-500 hover:text-[#061F35]"
                    >
                      support@homeserve.co.ke
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#061F35]">
                    <Phone size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-[#061F35]">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Customer support
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#061F35]">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-[#061F35]">
                      Service area
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Kenya
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="rounded-2xl bg-[#061F35] p-6 text-white sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <MessageCircle size={25} />
              </div>

              <h2 className="mt-6 text-xl font-bold">
                Chat with HomeServe
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Prefer WhatsApp? Start a conversation with the
                HomeServe team directly from your phone.
              </p>

              <button
                type="button"
                onClick={openWhatsApp}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#061F35] transition hover:bg-slate-100"
              >
                Open WhatsApp
                <ArrowRight size={17} />
              </button>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                WhatsApp contact is provided as a direct chat
                option. Automated WhatsApp notifications will be
                integrated separately.
              </p>
            </div>

            {/* FAQ link */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-bold text-[#061F35]">
                Looking for a quick answer?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Check our frequently asked questions before
                contacting the team.
              </p>

              <Link
                href="/faq"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#061F35] hover:underline"
              >
                Visit FAQ
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-[#061F35]">
            Ready to book a service?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Browse the available services and start your
            booking today.
          </p>

          <Link
            href="/services"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#061F35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#082B49]"
          >
            Browse Services
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#061F35] text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <Link
                href="/"
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg font-bold text-[#061F35]">
                  H
                </div>

                <span className="text-lg font-bold">
                  HomeServe
                </span>
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
                Professional home services made easier to
                discover, book, manage, and track.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-300">
              <Link
                href="/services"
                className="transition hover:text-white"
              >
                Services
              </Link>

              <Link
                href="/about"
                className="transition hover:text-white"
              >
                About
              </Link>

              <Link
                href="/pricing"
                className="transition hover:text-white"
              >
                Pricing
              </Link>

              <Link
                href="/faq"
                className="transition hover:text-white"
              >
                FAQ
              </Link>

              <Link
                href="/contact"
                className="text-white"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-slate-400">
            © {new Date().getFullYear()} HomeServe. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}