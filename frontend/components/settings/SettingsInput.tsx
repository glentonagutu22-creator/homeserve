"use client";

interface SettingInputProps {
  label: string;
  description?: string | null;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "number" | "password";
  placeholder?: string;
  disabled?: boolean;
}

export default function SettingInput({
  label,
  description,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
}: SettingInputProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-800">
        {label}
      </label>

      {description && (
        <p className="mt-1 text-xs font-medium leading-5 text-gray-600">
          {description}
        </p>
      )}

      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full rounded-lg border border-gray-400 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
      />
    </div>
  );
}