"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Image,
  Building2,
  MessageSquare,
  Users,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
  title: "Upcoming Classes",
  href: "/admin/upcoming",
  icon: CalendarDays,
},
  {
    title: "Services",
    href: "/admin/services",
    icon: Briefcase,
  },
   
  {
    title: "Gallery",
    href: "/admin/gallery",
    icon: Image,
  },
  {
    title: "Facilities",
    href: "/admin/facilities",
    icon: Building2,
  },
  {
    title: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquare,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Enrollment",
    href: "/admin/enrollments",
    icon: CalendarDays,
  },
   
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="border-b border-slate-800 px-6 py-5">
        <h2 className="text-2xl text-sky-500">Sky Solutions</h2>
       <p className="text-sm text-slate-400">
          Admin Panel
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                active
                  ? "bg-[#1877AE] text-white"
                  : "text-slate-300 hover:bg-[#1877AE] hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-11 w-11 rounded-full bg-sky-600 flex items-center justify-center font-bold">
            
          </div>

          <div>
            <h3 className="font-semibold">xyz</h3>
            <p className="text-sm text-slate-400">
              Administrator
            </p>
          </div>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1877AE] px-4 py-3 font-medium transition hover:bg-red-600">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}