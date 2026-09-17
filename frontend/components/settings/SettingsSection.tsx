interface SettingSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function SettingSection({
  title,
  description,
  children,
}: SettingSectionProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-5">
        <h2 className="text-lg font-bold text-[#061F35]">
          {title}
        </h2>

        <p className="mt-1 text-sm font-medium text-gray-600">
          {description}
        </p>
      </div>

      <div className="space-y-4 p-5">
        {children}
      </div>
    </section>
  );
}