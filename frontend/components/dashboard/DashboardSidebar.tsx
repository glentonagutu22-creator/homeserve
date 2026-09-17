"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "../AuthProvider";

interface NavigationItem {
  label: string;
  href: string;
}

const customerNavigation: NavigationItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
  },
  {
    label: "My Bookings",
    href: "/bookings",
  },
  {
    label: "Quotes",
    href: "/quotes",
  },
  {
    label: "Addresses",
    href: "/addresses",
  },
  {
    label: "Profile",
    href: "/dashboard/profile",


  },
  {
  label: "Settings",
  href: "/dashboard/settings",
},
];

const staffNavigation: NavigationItem[] = [
  {
    label: "Overview",
    href: "/staff",
  },
  {
    label: "My Jobs",
    href: "/staff/bookings",
  },
  {
    label: "Schedule",
    href: "/staff/schedule",
  },
  {
    label: "Profile",
    href: "/staff/profile",
  },

  {
  label: "Settings",
  href: "/staff/settings",
},
];

const adminNavigation: NavigationItem[] = [
  {
    label: "Overview",
    href: "/admin",
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
  },
  {
    label: "Customers",
    href: "/admin/customers",
  },
  {
    label: "Staff",
    href: "/admin/staff",
  },
  {
    label: "Services",
    href: "/admin/services",
  },
  {
    label: "Pricing",
    href: "/admin/pricing",
  },
  {
    label: "Quotes",
    href: "/admin/quotes",
  },
  {
    label: "Payments",
    href: "/admin/payments",
  },
  {
    label: "Reports",
    href: "/admin/reports",
  },
  {
    label: "Settings",
    href: "/admin/settings",
  },
];

function getNavigation(role?: string) {
  switch (role) {
    case "ADMIN":
      return adminNavigation;

    case "STAFF":
      return staffNavigation;

    default:
      return customerNavigation;
  }
}

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

export default function DashboardSidebar({
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navigation = getNavigation(
    user?.role
  );

  return (
    <aside
      className="
        flex
        h-full
        w-64
        flex-col
        bg-[#082B49]
      "
    >
      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="border-b border-white/10 px-6 py-5">
        <Link
          href="/services"
          onClick={onNavigate}
          className="inline-block"
        >
          <img
            src="/images/image.png"
            alt="HomeServe"
            className="w-28 brightness-0 invert"
          />
        </Link>

        <p className="mt-3 text-xs font-medium text-white/50">
          {user?.role === "ADMIN"
            ? "Administration"
            : user?.role === "STAFF"
            ? "Staff Portal"
            : "Customer Portal"}
        </p>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <p className="px-3 pb-3 text-xs font-bold uppercase tracking-wider text-white/40">
          Menu
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "/staff" &&
                item.href !== "/admin" &&
                pathname.startsWith(
                  `${item.href}/`
                ));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`
                  block
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  transition
                  ${
                    isActive
                      ? "bg-white text-[#082B49] shadow-sm"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* =====================================================
          USER
      ===================================================== */}

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#082B49]">
              {user?.name
                ?.charAt(0)
                .toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-white/50">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}