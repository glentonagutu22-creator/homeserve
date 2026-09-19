"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  ArrowRight,
  HelpCircle,
  CalendarCheck,
  Bell,
  CreditCard,
  Users,
  MapPin,
  FileText,
  ShieldCheck,
} from "lucide-react";

const faqSections = [
  {
    title: "Getting started",
    icon: HelpCircle,
    items: [
      {
        question: "What is HomeServe?",
        answer:
          "HomeServe is a service-booking platform that connects customers with professional service providers for cleaning, moving, and electrical services. Customers can browse services, make bookings, manage their addresses, receive updates, and track their service requests from their account.",
      },
      {
        question: "Do I need a HomeServe account to book a service?",
        answer:
          "Yes. You need to sign in or create a HomeServe account before completing a booking. This allows HomeServe to associate the booking with you, manage your service address, send notifications, and provide access to your booking history.",
      },
      {
        question: "What services does HomeServe provide?",
        answer:
          "HomeServe currently focuses on three main service categories: cleaning, moving, and electrical services. Each category contains different services that can be selected when making a booking.",
      },
      {
        question: "How do I create an account?",
        answer:
          "Select Register from the HomeServe navigation, provide the required account information, and complete registration. You can then sign in and start booking services.",
      },
    ],
  },
  {
    title: "Bookings",
    icon: CalendarCheck,
    items: [
      {
        question: "How does the booking process work?",
        answer:
          "Choose a service, provide the required service details, select or add your service address, choose the appropriate date and time information, review the calculated price or quote request, and submit your booking. Your booking is then available from your account.",
      },
      {
        question: "What happens after I submit a booking?",
        answer:
          "The booking is recorded in your HomeServe account. Depending on the type of service and pricing method, it may receive an immediate calculated price or enter a quote workflow. HomeServe administrators can then manage the booking and assign an appropriate staff member when required.",
      },
      {
        question: "Can I view my previous bookings?",
        answer:
          "Yes. Your account includes a bookings section where you can view your current and previous bookings and open individual booking details.",
      },
      {
        question: "Can I cancel a booking?",
        answer:
          "Bookings can be cancelled through the booking management flow when cancellation is allowed for that booking. When a cancellation is processed, the relevant booking status is updated and notifications can be sent to the affected parties.",
      },
    ],
  },
  {
    title: "Pricing and quotes",
    icon: FileText,
    items: [
      {
        question: "How is the price of a service determined?",
        answer:
          "HomeServe uses different pricing methods depending on the service. Some services have fixed prices, some use configured calculations based on service requirements, and others require a quote.",
      },
      {
        question: "What is instant pricing?",
        answer:
          "Instant pricing means HomeServe can calculate the applicable amount from the information provided during booking. When an instant price is available, you can review the amount before submitting the booking.",
      },
      {
        question: "Why do some services require a quote?",
        answer:
          "Some jobs cannot be priced accurately from a standard set of booking information. For these services, HomeServe can create a quote request so that the required work can be assessed before a final price is accepted.",
      },
      {
        question: "What happens when I receive a quote?",
        answer:
          "A quote can be reviewed from your account. Depending on the quote status, you can accept or reject it. Accepting a quote confirms the associated booking and allows the service workflow to continue.",
      },
    ],
  },
  {
    title: "Staff and service delivery",
    icon: Users,
    items: [
      {
        question: "Who assigns a staff member to my booking?",
        answer:
          "HomeServe administrators manage staff assignments. They can assign an appropriate staff member based on the service requirements and the staff member's availability.",
      },
      {
        question: "Will I know when someone is assigned to my booking?",
        answer:
          "Yes. HomeServe can send notifications when a staff member is assigned to a booking. You can also see relevant booking information from your account.",
      },
      {
        question: "What happens when the staff member starts the job?",
        answer:
          "The booking status can be updated as the service progresses. Customers can receive notifications when important status changes occur, including when work starts and when the service is completed.",
      },
      {
        question: "What happens when the service is completed?",
        answer:
          "The booking is updated to reflect completion. You can then review the completed booking and, where enabled, provide feedback about the service.",
      },
    ],
  },
  {
    title: "Addresses and notifications",
    icon: MapPin,
    items: [
      {
        question: "Can I save multiple service addresses?",
        answer:
          "Yes. Your HomeServe account can contain saved addresses that you can manage and use when making bookings.",
      },
      {
        question: "Can I change an address after adding it?",
        answer:
          "Yes. Saved addresses can be updated from the address management section of your account, subject to the restrictions associated with existing bookings.",
      },
      {
        question: "How will HomeServe notify me?",
        answer:
          "HomeServe supports in-app notifications and can also send relevant email and SMS notifications for supported booking, quote, staff assignment, payment, and service-status events.",
      },
      {
        question: "Where can I see my notifications?",
        answer:
          "Notifications are available through your HomeServe account. Important events such as booking updates, quote changes, staff assignments, and service progress can appear there.",
      },
    ],
  },
  {
    title: "Payments",
    icon: CreditCard,
    items: [
      {
        question: "How can I pay for a HomeServe service?",
        answer:
          "HomeServe's payment system supports configured payment methods including M-Pesa, card, and cash. The payment options available for a particular booking depend on the current payment workflow.",
      },
      {
        question: "Will I receive payment status updates?",
        answer:
          "Payment records have their own status, and supported payment events can generate notifications. This allows the booking and payment state to be tracked separately.",
      },
      {
        question: "What happens if a payment fails?",
        answer:
          "A failed payment is recorded with a failed payment status. Where notifications are enabled for the event, the relevant user can be informed so the payment can be addressed.",
      },
    ],
  },
  {
    title: "Accounts and security",
    icon: ShieldCheck,
    items: [
      {
        question: "What information does HomeServe keep about my account?",
        answer:
          "Your account contains information needed to provide the service, such as your name, contact information, saved addresses, bookings, and related service information.",
      },
      {
        question: "Can I update my profile information?",
        answer:
          "Yes. You can manage supported profile information from your account profile settings.",
      },
      {
        question: "Who manages HomeServe bookings?",
        answer:
          "HomeServe uses different roles for different responsibilities. Customers manage their own bookings and information, staff handle assigned service work, and administrators manage operational areas such as bookings, users, staff, pricing, quotes, and reports.",
      },
    ],
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-[#061F35]">
          {question}
        </span>

        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
            isOpen
              ? "bg-[#061F35] text-white"
              : "bg-slate-100 text-[#061F35]"
          }`}
        >
          <ChevronDown
            size={18}
            className={`transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {isOpen && (
        <div className="pb-5 pr-12">
          <p className="text-sm leading-7 text-slate-600">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  function toggleItem(key: string) {
    setOpenItem((current) =>
      current === key ? null : key
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
              className="text-sm font-semibold text-[#061F35]"
            >
              FAQ
            </Link>

            <Link
              href="/contact"
              className="text-sm font-medium text-slate-600 transition hover:text-[#061F35]"
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
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#061F35]">
            <HelpCircle size={28} />
          </div>

          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Frequently Asked Questions
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[#061F35] sm:text-5xl">
            Everything you need to know about HomeServe
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Learn how bookings, pricing, quotes, staff assignments,
            notifications, payments, and your HomeServe account work.
          </p>
        </div>
      </section>

      {/* FAQ content */}
      <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="space-y-8">
          {faqSections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.title}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#061F35]">
                    <Icon size={20} />
                  </div>

                  <h2 className="text-lg font-bold text-[#061F35]">
                    {section.title}
                  </h2>
                </div>

                <div className="px-6">
                  {section.items.map((item, index) => {
                    const key = `${section.title}-${index}`;
                    const isOpen = openItem === key;

                    return (
                      <FAQItem
                        key={key}
                        question={item.question}
                        answer={item.answer}
                        isOpen={isOpen}
                        onToggle={() => toggleItem(key)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Still have questions */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-[#061F35]">
            Still have a question?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            If you need more information about a service or your
            booking, you can contact the HomeServe team.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#061F35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#082B49]"
            >
              Contact HomeServe
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#061F35] transition hover:bg-slate-50"
            >
              Browse Services
            </Link>
          </div>
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
                className="text-white"
              >
                FAQ
              </Link>

              <Link
                href="/contact"
                className="transition hover:text-white"
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