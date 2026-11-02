
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarDays,
  FileText,
  MapPin,
  UserRound,
  BriefcaseBusiness,
  Users,
  Wallet,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "../AuthProvider";

interface NavigationItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  action?: "more";
}

const customerNavigation: NavigationItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Bookings", href: "/bookings", icon: CalendarDays },
  { label: "Quotes", href: "/quotes", icon: FileText },
  { label: "Addresses", href: "/addresses", icon: MapPin },
  { label: "Profile", href: "/dashboard/profile", icon: UserRound },
];

const staffNavigation: NavigationItem[] = [
  { label: "Home", href: "/staff", icon: Home },
  { label: "Jobs", href: "/staff/bookings", icon: BriefcaseBusiness },
  { label: "Schedule", href: "/staff/schedule", icon: CalendarDays },
  { label: "Profile", href: "/staff/profile", icon: UserRound },
  { label: "More", icon: MoreHorizontal, action: "more" },
];

const adminNavigation: NavigationItem[] = [
  { label: "Home", href: "/admin", icon: Home },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Payments", href: "/admin/payments", icon: Wallet },
  { label: "More", icon: MoreHorizontal, action: "more" },
];

interface BottomNavigationProps {
  onMoreClick: () => void;
}

export default function BottomNavigation({
  onMoreClick,
}: BottomNavigationProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navigation =
    user?.role === "ADMIN"
      ? adminNavigation
      : user?.role === "STAFF"
        ? staffNavigation
        : customerNavigation;

  function isActive(href?: string) {
    if (!href) return false;

    if (
      href === "/dashboard" ||
      href === "/staff" ||
      href === "/admin"
    ) {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="
        fixed
        inset-x-0
        bottom-0
        z-30
        border-t
        border-slate-200
        bg-white
        pb-[env(safe-area-inset-bottom)]
        shadow-[0_-4px_15px_rgba(0,0,0,0.05)]
        lg:hidden
      "
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.action === "more") {
            return (
              <button
                key={item.label}
                type="button"
                onClick={onMoreClick}
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  text-slate-500
                  transition
                  hover:text-[#082B49]
                  active:scale-95
                "
                aria-label="Open more navigation options"
              >
                <Icon className="h-5 w-5" />

                <span className="text-[10px] font-medium">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              aria-current={active ? "page" : undefined}
              className={`
                flex
                flex-col
                items-center
                justify-center
                gap-1
                transition
                active:scale-95
                ${
                  active
                    ? "text-[#082B49]"
                    : "text-slate-400 hover:text-slate-700"
                }
              `}
            >
              <Icon
                className={`h-5 w-5 ${
                  active ? "stroke-[2.5]" : ""
                }`}
              />

              <span
                className={`text-[10px] ${
                  active
                    ? "font-bold"
                    : "font-medium"
                }`}
              >
                {item.label}
              </span>

              {active && (
                <span className="absolute bottom-[calc(env(safe-area-inset-bottom)+3.25rem)] h-0.5 w-6 rounded-full bg-[#082B49]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
