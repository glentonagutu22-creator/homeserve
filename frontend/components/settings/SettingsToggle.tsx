"use client";

interface SettingToggleProps {
  label: string;
  description?: string | null;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export default function SettingToggle({
  label,
  description,
  enabled,
  onChange,
  disabled = false,
}: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="min-w-0">
        <p className="text-sm font-bold text-gray-900">
          {label}
        </p>

        {description && (
          <p className="mt-1 max-w-2xl text-xs font-medium leading-5 text-gray-600">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!enabled)}
        aria-pressed={enabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-blue-600"
            : "bg-gray-300"
        } ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}