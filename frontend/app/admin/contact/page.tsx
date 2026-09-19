"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  CheckCircle2,
  Clock3,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  Search,
  XCircle,
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

function getStatusStyles(
  status: ContactMessageStatus
) {
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

function getStatusIcon(
  status: ContactMessageStatus
) {
  switch (status) {
    case "NEW":
      return <MessageSquare size={14} />;

    case "READ":
      return <Eye size={14} />;

    case "RESPONDED":
      return <CheckCircle2 size={14} />;

    case "CLOSED":
      return <XCircle size={14} />;

    default:
      return <Clock3 size={14} />;
  }
}

export default function AdminContactPage() {
  const [messages, setMessages] =
    useState<AdminContactMessage[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | ContactMessageStatus>(
      "ALL"
    );

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [selectedMessage, setSelectedMessage] =
    useState<AdminContactMessage | null>(null);

  async function loadMessages() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getContactMessages();

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

      const updated =
        await updateContactMessageStatus(
          id,
          status
        );

      setMessages((current) =>
        current.map((message) =>
          message.id === id
            ? updated
            : message
        )
      );

      setSelectedMessage((current) =>
        current?.id === id
          ? updated
          : current
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
    const searchTerm =
      search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesSearch =
        !searchTerm ||
        message.name
          .toLowerCase()
          .includes(searchTerm) ||
        message.email
          .toLowerCase()
          .includes(searchTerm) ||
        message.subject
          .toLowerCase()
          .includes(searchTerm) ||
        message.message
          .toLowerCase()
          .includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" ||
        message.status === statusFilter;

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [messages, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: messages.length,

      new: messages.filter(
        (message) =>
          message.status === "NEW"
      ).length,

      responded: messages.filter(
        (message) =>
          message.status === "RESPONDED"
      ).length,

      closed: messages.filter(
        (message) =>
          message.status === "CLOSED"
      ).length,
    };
  }, [messages]);

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Administration
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#061F35]">
                Contact Messages
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage inquiries submitted through the
                HomeServe contact page.
              </p>
            </div>

            <button
              type="button"
              onClick={loadMessages}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#061F35] transition hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Total Messages
            </p>

            <p className="mt-2 text-3xl font-bold text-[#061F35]">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-sm text-blue-700">
              New
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-800">
              {stats.new}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="text-sm text-green-700">
              Responded
            </p>

            <p className="mt-2 text-3xl font-bold text-green-800">
              {stats.responded}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-600">
              Closed
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-700">
              {stats.closed}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, email, subject, or message..."
              className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | "ALL"
                  | ContactMessageStatus
              )
            }
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-[#061F35]"
          >
            <option value="ALL">
              All statuses
            </option>

            {statusOptions.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Messages */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading contact messages...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-10 text-center">
              <MessageSquare
                size={36}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-4 text-lg font-semibold text-[#061F35]">
                No contact messages
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                No messages match the current search
                or status filter.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Subject
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Submitted
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredMessages.map(
                      (message) => (
                        <tr
                          key={message.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-5">
                            <p className="font-semibold text-[#061F35]">
                              {message.name}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {message.email}
                            </p>
                          </td>

                          <td className="max-w-xs px-6 py-5">
                            <p className="truncate font-medium text-slate-700">
                              {message.subject}
                            </p>

                            <p className="mt-1 truncate text-sm text-slate-400">
                              {message.message}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyles(
                                message.status
                              )}`}
                            >
                              {getStatusIcon(
                                message.status
                              )}

                              {message.status}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-500">
                            {formatDate(
                              message.createdAt
                            )}
                          </td>

                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedMessage(
                                  message
                                )
                              }
                              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-[#061F35] transition hover:bg-slate-50"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredMessages.map(
                  (message) => (
                    <div
                      key={message.id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-[#061F35]">
                            {message.name}
                          </p>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {message.email}
                          </p>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${getStatusStyles(
                            message.status
                          )}`}
                        >
                          {getStatusIcon(
                            message.status
                          )}

                          {message.status}
                        </span>
                      </div>

                      <h3 className="mt-4 font-semibold text-slate-700">
                        {message.subject}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                        {message.message}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {formatDate(
                            message.createdAt
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedMessage(
                              message
                            )
                          }
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-[#061F35]"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Contact Message
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#061F35]">
                  {selectedMessage.subject}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedMessage(null)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <XCircle size={22} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Customer */}
              <div className="rounded-xl bg-slate-50 p-5">
                <h3 className="font-semibold text-[#061F35]">
                  Customer
                </h3>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Name
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {selectedMessage.name}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail
                      size={17}
                      className="mt-0.5 text-slate-400"
                    />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Email
                      </p>

                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="mt-1 block text-sm font-medium text-[#061F35] hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  {selectedMessage.phone && (
                    <div className="flex items-start gap-3">
                      <Phone
                        size={17}
                        className="mt-0.5 text-slate-400"
                      />

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Phone
                        </p>

                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="mt-1 block text-sm font-medium text-[#061F35] hover:underline"
                        >
                          {selectedMessage.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-[#061F35]">
                    Message
                  </h3>

                  <span className="text-xs text-slate-400">
                    {formatDate(
                      selectedMessage.createdAt
                    )}
                  </span>
                </div>

                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="message-status"
                  className="mb-2 block text-sm font-semibold text-[#061F35]"
                >
                  Message status
                </label>

                <select
                  id="message-status"
                  value={selectedMessage.status}
                  disabled={
                    updatingId ===
                    selectedMessage.id
                  }
                  onChange={(event) =>
                    handleStatusChange(
                      selectedMessage.id,
                      event.target
                        .value as ContactMessageStatus
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-[#061F35] focus:ring-2 focus:ring-blue-100"
                >
                  {statusOptions.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>

                {updatingId ===
                  selectedMessage.id && (
                  <p className="mt-2 text-xs text-slate-500">
                    Updating status...
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#061F35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#082B49]"
                >
                  <Mail size={17} />
                  Reply by Email
                </a>

                {selectedMessage.phone && (
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-[#061F35] transition hover:bg-slate-50"
                  >
                    <Phone size={17} />
                    Call
                  </a>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedMessage(null)
                  }
                  className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}