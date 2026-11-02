
"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  Clock3,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  Search,
  XCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  getContactMessages,
  updateContactMessageStatus,
  type AdminContactMessage,
  type ContactMessageStatus,
} from "@/lib/contact-admin";

const statusOptions: ContactMessageStatus[] = [
  "NEW",
  "READ",
  "RESPONDED",
  "CLOSED",
];

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusStyles(status: ContactMessageStatus) {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-700";

    case "READ":
      return "bg-amber-100 text-amber-700";

    case "RESPONDED":
      return "bg-green-100 text-green-700";

    case "CLOSED":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getStatusIcon(status: ContactMessageStatus) {
  switch (status) {
    case "NEW":
      return <MessageSquare size={13} />;

    case "READ":
      return <Eye size={13} />;

    case "RESPONDED":
      return <CheckCircle2 size={13} />;

    case "CLOSED":
      return <XCircle size={13} />;

    default:
      return <Clock3 size={13} />;
  }
}

function StatusBadge({
  status,
}: {
  status: ContactMessageStatus;
}) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 border border-current/10 px-2 py-1 text-[10px] font-bold ${getStatusStyles(
        status
      )}`}
    >
      {getStatusIcon(status)}
      <span>{status}</span>
    </span>
  );
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | ContactMessageStatus
  >("ALL");

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] =
    useState<AdminContactMessage | null>(null);

  async function loadMessages() {
    try {
      setLoading(true);
      setError("");

      const data = await getContactMessages();
      setMessages(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load contact messages."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function handleStatusChange(
    id: string,
    status: ContactMessageStatus
  ) {
    try {
      setUpdatingId(id);
      setError("");

      const updated = await updateContactMessageStatus(id, status);

      setMessages((current) =>
        current.map((message) =>
          message.id === id ? updated : message
        )
      );

      setSelectedMessage((current) =>
        current?.id === id ? updated : current
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update message status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredMessages = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesSearch =
        !searchTerm ||
        message.name.toLowerCase().includes(searchTerm) ||
        message.email.toLowerCase().includes(searchTerm) ||
        message.subject.toLowerCase().includes(searchTerm) ||
        message.message.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" ||
        message.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [messages, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: messages.length,
      new: messages.filter((message) => message.status === "NEW").length,
      responded: messages.filter(
        (message) => message.status === "RESPONDED"
      ).length,
      closed: messages.filter(
        (message) => message.status === "CLOSED"
      ).length,
    };
  }, [messages]);

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-7xl space-y-4 pb-6 sm:space-y-5">
        {/* PAGE HEADER */}
        <div className="border border-[#061F35] bg-[#061F35] px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/20 bg-white/10">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-200">
                  Administration
                </p>

                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Contact Messages
                </h1>

                <p className="mt-1 text-xs leading-relaxed text-blue-100 sm:text-sm">
                  Manage inquiries submitted through the HomeServe contact page.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadMessages}
              disabled={loading}
              className="inline-flex min-h-9 w-full items-center justify-center gap-2 border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20 disabled:opacity-60 sm:w-auto"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              Refresh
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700 sm:text-sm">
            <AlertCircleIcon />
            <span className="min-w-0 flex-1 break-words">{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 font-semibold underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* STATISTICS */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          <div className="min-w-0 border border-slate-200 bg-white p-3 sm:p-4">
            <p className="text-[10px] font-medium text-slate-500 sm:text-xs">
              Total Messages
            </p>
            <p className="mt-2 text-2xl font-bold text-[#061F35] sm:text-3xl">
              {stats.total}
            </p>
          </div>

          <div className="min-w-0 border border-blue-200 bg-blue-50 p-3 sm:p-4">
            <p className="text-[10px] font-medium text-blue-700 sm:text-xs">
              New
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-800 sm:text-3xl">
              {stats.new}
            </p>
          </div>

          <div className="min-w-0 border border-green-200 bg-green-50 p-3 sm:p-4">
            <p className="text-[10px] font-medium text-green-700 sm:text-xs">
              Responded
            </p>
            <p className="mt-2 text-2xl font-bold text-green-800 sm:text-3xl">
              {stats.responded}
            </p>
          </div>

          <div className="min-w-0 border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <p className="text-[10px] font-medium text-slate-600 sm:text-xs">
              Closed
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-700 sm:text-3xl">
              {stats.closed}
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 gap-3 border border-slate-200 bg-white p-3 sm:p-4 lg:grid-cols-[1fr_190px]">
          <div className="relative min-w-0">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, subject or message..."
              className="h-10 w-full border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#061F35] focus:ring-2 focus:ring-blue-100 sm:text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "ALL" | ContactMessageStatus
              )
            }
            className="h-10 w-full border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-[#061F35] sm:text-sm"
          >
            <option value="ALL">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* MESSAGE RESULTS */}
        <div className="overflow-hidden border border-slate-200 bg-white">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-2 p-8 text-xs text-slate-500 sm:text-sm">
              <Loader2 size={17} className="animate-spin" />
              Loading contact messages...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-4 py-10 text-center">
              <MessageSquare size={32} className="text-slate-300" />

              <h2 className="mt-3 text-sm font-bold text-[#061F35] sm:text-base">
                No contact messages
              </h2>

              <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm">
                No messages match the current search or status filter.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Customer
                      </th>

                      <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Subject
                      </th>

                      <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Submitted
                      </th>

                      <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredMessages.map((message) => (
                      <tr
                        key={message.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="max-w-[220px] px-5 py-4">
                          <p className="truncate text-sm font-semibold text-[#061F35]">
                            {message.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {message.email}
                          </p>
                        </td>

                        <td className="max-w-xs px-5 py-4">
                          <p className="truncate text-sm font-medium text-slate-700">
                            {message.subject}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-400">
                            {message.message}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={message.status} />
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                          {formatDate(message.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedMessage(message)}
                            className="border border-slate-300 px-3 py-2 text-xs font-semibold text-[#061F35] transition hover:bg-slate-50"
                          >
                            View message
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE AND TABLET TWO-COLUMN CARDS */}
              <div className="grid grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-3 lg:hidden">
                {filteredMessages.map((message) => (
                  <article
                    key={message.id}
                    className="flex min-w-0 flex-col border border-slate-200 bg-white p-2.5 sm:p-3"
                  >
                    <div className="flex min-w-0 flex-col items-start gap-2">
                      <StatusBadge status={message.status} />

                      <div className="w-full min-w-0">
                        <h3 className="truncate text-xs font-bold text-[#061F35] sm:text-sm">
                          {message.name}
                        </h3>

                        <p className="mt-0.5 break-all text-[10px] leading-relaxed text-slate-500 sm:text-xs">
                          {message.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 min-w-0 flex-1 border-t border-slate-100 pt-2">
                      <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-700 sm:text-sm">
                        {message.subject}
                      </p>

                      <p className="mt-1 line-clamp-3 break-words text-[10px] leading-relaxed text-slate-500 sm:text-xs">
                        {message.message}
                      </p>
                    </div>

                    <div className="mt-3 border-t border-slate-100 pt-2">
                      <p className="text-[9px] leading-relaxed text-slate-400 sm:text-[10px]">
                        {formatDate(message.createdAt)}
                      </p>

                      <button
                        type="button"
                        onClick={() => setSelectedMessage(message)}
                        className="mt-2 flex min-h-8 w-full items-center justify-center gap-1 border border-[#061F35] bg-[#061F35] px-2 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#082B49] sm:text-xs"
                      >
                        <Eye size={12} />
                        View
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        {!loading && filteredMessages.length > 0 && (
          <p className="text-right text-[10px] text-slate-400 sm:text-xs">
            Showing {filteredMessages.length} of {messages.length} messages
          </p>
        )}
      </div>

      {/* MESSAGE DETAIL MODAL */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 sm:items-center sm:p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMessage(null);
            }
          }}
        >
          <div className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl sm:max-h-[90vh]">
            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 bg-[#061F35] px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-200">
                  Contact Message
                </p>

                <h2 className="mt-1 break-words text-base font-bold text-white sm:text-lg">
                  {selectedMessage.subject}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                aria-label="Close message details"
                className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/20 text-white transition hover:bg-white/10"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 sm:space-y-5 sm:p-5">
              {/* CUSTOMER */}
              <section className="border border-slate-200 bg-slate-50 p-3 sm:p-4">
                <h3 className="text-xs font-bold text-[#061F35] sm:text-sm">
                  Customer Information
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                      Name
                    </p>
                    <p className="mt-1 break-words text-xs font-medium text-slate-700 sm:text-sm">
                      {selectedMessage.name}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                      Submitted
                    </p>
                    <p className="mt-1 break-words text-xs text-slate-600 sm:text-sm">
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>

                  <div className="col-span-2 flex min-w-0 items-start gap-2">
                    <Mail
                      size={15}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Email
                      </p>

                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="mt-1 block break-all text-xs font-medium text-[#061F35] hover:underline sm:text-sm"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  {selectedMessage.phone && (
                    <div className="col-span-2 flex min-w-0 items-start gap-2">
                      <Phone
                        size={15}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <div className="min-w-0">
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                          Phone
                        </p>

                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="mt-1 block break-all text-xs font-medium text-[#061F35] hover:underline sm:text-sm"
                        >
                          {selectedMessage.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* MESSAGE BODY */}
              <section>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs font-bold text-[#061F35] sm:text-sm">
                    Message
                  </h3>
                  <StatusBadge status={selectedMessage.status} />
                </div>

                <div className="mt-2 border border-slate-200 bg-white p-3 sm:p-4">
                  <p className="whitespace-pre-wrap break-words text-xs leading-6 text-slate-600 sm:text-sm sm:leading-7">
                    {selectedMessage.message}
                  </p>
                </div>
              </section>

              {/* STATUS */}
              <section>
                <label
                  htmlFor="message-status"
                  className="mb-2 block text-xs font-semibold text-[#061F35] sm:text-sm"
                >
                  Message Status
                </label>

                <select
                  id="message-status"
                  value={selectedMessage.status}
                  disabled={updatingId === selectedMessage.id}
                  onChange={(event) =>
                    handleStatusChange(
                      selectedMessage.id,
                      event.target.value as ContactMessageStatus
                    )
                  }
                  className="h-10 w-full border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-[#061F35] focus:ring-2 focus:ring-blue-100 sm:text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {updatingId === selectedMessage.id && (
                  <p className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 sm:text-xs">
                    <Loader2 size={13} className="animate-spin" />
                    Updating status...
                  </p>
                )}
              </section>

              {/* ACTIONS */}
              <section className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-4 sm:flex sm:flex-row">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="col-span-2 inline-flex min-h-10 items-center justify-center gap-2 border border-[#061F35] bg-[#061F35] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#082B49] sm:flex-1"
                >
                  <Mail size={15} />
                  Reply by Email
                </a>

                {selectedMessage.phone && (
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="inline-flex min-h-10 items-center justify-center gap-2 border border-slate-300 px-3 py-2 text-xs font-semibold text-[#061F35] transition hover:bg-slate-50 sm:flex-1"
                  >
                    <Phone size={15} />
                    Call
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="inline-flex min-h-10 items-center justify-center border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:flex-1"
                >
                  Close
                </button>
              </section>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function AlertCircleIcon() {
  return <XCircle size={16} className="mt-0.5 shrink-0" />;
}
