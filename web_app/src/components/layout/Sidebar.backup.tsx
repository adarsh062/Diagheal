"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Overview", path: "/dashboard", icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
      )
    },
    {
      name: "Analyze", path: "/dashboard/analyze", icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      )
    },
    {
      name: "History", path: "/dashboard/history", icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    },
    {
      name: "Doctors", path: "/dashboard/doctors", icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
      )
    },
    {
      name: "Settings", path: "/dashboard/settings", icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      )
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname === path || pathname.startsWith(path + "/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 left-0 bg-white/70 dark:bg-[#0f172a]/95 backdrop-blur-xl border-r border-white/40 dark:border-white/5 shadow-xl z-40 transition-all duration-300 shrink-0 ${isCollapsed ? "w-[68px]" : "w-56"}`}
      >
        {/* Header */}
        <div className={`px-3 py-4 flex items-center border-b border-gray-100 dark:border-white/5 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <Link href="/" className="block cursor-pointer hover:opacity-80 transition">
              <Image src="/assets/logo.png" alt="DiagHeal" width={90} height={28} className="object-contain dark:brightness-0 dark:invert" />
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:text-cyan-700 dark:hover:text-cyan-400 transition shrink-0"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isCollapsed
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              }
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              title={isCollapsed ? item.name : ""}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive(item.path)
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-200/30 dark:shadow-none"
                : "text-gray-600 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-white/5 hover:text-cyan-700 dark:hover:text-cyan-400"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <span className={`shrink-0 ${isActive(item.path) ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400"}`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="font-barlow font-semibold text-sm whitespace-nowrap">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-gray-100 dark:border-white/5">
          <div className={`flex items-center gap-2.5 p-2 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white dark:border-slate-700 transition-all ${isCollapsed ? "justify-center bg-transparent border-none p-0" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-bold shrink-0 text-xs font-poppins">
              {initials}
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-900 dark:text-white font-poppins truncate">{user?.name ?? "User"}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate font-barlow">{user?.email ?? ""}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom" aria-label="Mobile navigation">
        <div className="bg-white/95 dark:bg-slate-900/97 backdrop-blur-xl border-t border-gray-200/80 dark:border-slate-700/80 shadow-2xl">
          <div className="flex items-center justify-around px-1 py-1.5 pb-2 max-w-lg mx-auto">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all duration-200 min-w-0 flex-1 ${
                    active
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-gray-400 dark:text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400"
                  }`}
                >
                  {/* Active indicator pill */}
                  {active && (
                    <span className="absolute top-0 inset-x-2 h-0.5 bg-cyan-500 dark:bg-cyan-400 rounded-full" />
                  )}
                  <span className={`transition-transform duration-200 ${active ? "scale-110" : ""}`}>
                    {item.icon}
                  </span>
                  <span className={`text-[10px] font-bold font-barlow tracking-wide truncate transition-colors ${active ? "text-cyan-600 dark:text-cyan-400" : ""}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}