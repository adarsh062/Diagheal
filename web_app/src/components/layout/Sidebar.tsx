"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeProvider";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: "Analyze",
      path: "/dashboard/analyze",
      badge: "AI",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      name: "History",
      path: "/dashboard/history",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: "Doctors",
      path: "/dashboard/doctors",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  const bottomItems = [
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname === path || pathname.startsWith(path + "/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Shared nav link renderer
  const NavLink = ({ item }: { item: typeof menuItems[0] & { badge?: string } }) => {
    const active = isActive(item.path);
    return (
      <Link
        href={item.path}
        title={isCollapsed ? item.name : ""}
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
          active
            ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/20 dark:shadow-cyan-900/30"
            : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/8 hover:text-gray-900 dark:hover:text-white"
        } ${isCollapsed ? "justify-center" : ""}`}
      >
        {/* Active indicator bar */}
        {active && !isCollapsed && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white/60 rounded-full -ml-3" />
        )}

        <span className={`shrink-0 transition-colors ${active ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400"}`}>
          {item.icon}
        </span>

        {!isCollapsed && (
          <span className="font-semibold text-sm font-barlow leading-none">{item.name}</span>
        )}

        {/* Badge (e.g. "AI") */}
        {!isCollapsed && "badge" in item && item.badge && !active && (
          <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-md bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* ═══════════════════════════════════════
          DESKTOP SIDEBAR
      ═══════════════════════════════════════ */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 bg-white/75 dark:bg-slate-950/90 backdrop-blur-2xl border-r border-gray-200/60 dark:border-white/5 z-40 transition-[width] duration-300 ease-in-out shrink-0 shadow-lg shadow-gray-200/30 dark:shadow-black/30 ${
          isCollapsed ? "w-[64px]" : "w-[220px]"
        }`}
      >
        {/* ── Logo + Collapse Toggle ── */}
        <div className={`flex items-center border-b border-gray-100 dark:border-white/5 px-3 h-14 shrink-0 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <Link href="/" className="hover:opacity-75 transition-opacity">
              <Image
                src="/assets/logo.png"
                alt="DiagHeal"
                width={88}
                height={26}
                className="object-contain dark:brightness-0 dark:invert"
                priority
              />
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-gray-200 transition shrink-0"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* ── Main Nav ── */}
        <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && (
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-400 dark:text-gray-600 px-3 mb-2 select-none">
              Main
            </p>
          )}
          {menuItems.map((item) => <NavLink key={item.name} item={item} />)}
        </nav>

        {/* ── Bottom Section: theme + settings + user ── */}
        <div className="px-2.5 pb-4 space-y-0.5 border-t border-gray-100 dark:border-white/5 pt-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isCollapsed ? (theme === "dark" ? "Light Mode" : "Dark Mode") : ""}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/8 hover:text-gray-900 dark:hover:text-white transition-all group ${isCollapsed ? "justify-center" : ""}`}
          >
            <span className="shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              {theme === "dark" ? (
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </span>
            {!isCollapsed && (
              <span className="text-sm font-semibold font-barlow flex-1 text-left">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>

          {/* Settings */}
          {bottomItems.map((item) => <NavLink key={item.name} item={item} />)}

          {/* Divider */}
          <div className="my-1 border-t border-gray-100 dark:border-white/5" />

          {/* User card */}
          <div className={`flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white dark:hover:bg-white/8 transition-all cursor-pointer group ${isCollapsed ? "justify-center" : ""}`}
            title={isCollapsed ? (user?.name ?? "User") : ""}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs font-poppins shrink-0">
              {initials}
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-800 dark:text-white font-poppins truncate leading-tight">
                  {user?.name ?? "User"}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate font-barlow leading-tight">
                  {user?.email ?? ""}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                title="Sign out"
                className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition opacity-0 group-hover:opacity-100 shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════
          MOBILE BOTTOM NAVIGATION
      ═══════════════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Mobile navigation"
      >
        <div className="bg-white/95 dark:bg-slate-950/97 backdrop-blur-2xl border-t border-gray-200/80 dark:border-white/5 shadow-2xl shadow-black/10">
          <div className="flex items-center justify-around px-2 pt-2 pb-3 max-w-sm mx-auto">
            {[...menuItems, ...bottomItems].map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className="relative flex flex-col items-center gap-1 flex-1 py-1 rounded-2xl transition-all duration-200 group"
                >
                  {/* Active pill indicator */}
                  {active && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-cyan-500 dark:bg-cyan-400 rounded-full" />
                  )}
                  <span className={`p-1.5 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 scale-110"
                      : "text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                  }`}>
                    {item.icon}
                  </span>
                  <span className={`text-[10px] font-bold font-barlow tracking-wide transition-colors ${
                    active ? "text-cyan-600 dark:text-cyan-400" : "text-gray-400 dark:text-gray-500"
                  }`}>
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