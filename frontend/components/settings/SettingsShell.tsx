"use client";

import { useState } from "react";

import SettingsSidebar from "./SettingsSidebar";

interface SettingsSection {
  id: string;
  label: string;
}

interface SettingsShellProps {
  title: string;
  description?: string;
  sections: SettingsSection[];
  children: (activeSection: string) => React.ReactNode;
}

export default function SettingsShell({
  title,
  description,
  sections,
  children,
}: SettingsShellProps) {
  const [activeSection, setActiveSection] = useState(
    sections[0]?.id ?? ""
  );

  return (
    <div className="space-y-6">
      {/* Settings header */}
      <div>
        <h2 className="text-xl font-bold text-[#061F35]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-gray-600">
            {description}
          </p>
        )}
      </div>

      {/* Settings layout */}
      <div className="lg:flex lg:items-start lg:gap-6">
        {/* Navigation */}
        <div className="shrink-0 lg:sticky lg:top-6 lg:w-64">
          <SettingsSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            sections={sections}
          />
        </div>

        {/* Content */}
        <main className="mt-6 min-w-0 flex-1 lg:mt-0">
          {children(activeSection)}
        </main>
      </div>
    </div>
  );
}