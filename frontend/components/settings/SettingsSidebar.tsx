"use client";

interface SettingsSection {
  id: string;
  label: string;
}

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  sections: SettingsSection[];
}

export default function SettingsSidebar({
  activeSection,
  onSectionChange,
  sections,
}: SettingsSidebarProps) {
  return (
    <nav
      className="
        w-full
        overflow-x-auto
        rounded-xl
        border border-gray-200
        bg-white
        shadow-sm
        lg:overflow-visible
      "
    >
      <div
        className="
          flex
          min-w-max
          gap-2
          p-2
          lg:block
          lg:min-w-0
          lg:space-y-1
        "
      >
        {sections.map((section) => {
          const isActive =
            activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() =>
                onSectionChange(section.id)
              }
              className={`
                whitespace-nowrap
                rounded-lg
                px-4
                py-2.5
                text-sm
                font-semibold
                transition
                lg:block
                lg:w-full
                lg:text-left
                ${
                  isActive
                    ? "bg-blue-50 text-[#061F35]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#061F35]"
                }
              `}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}