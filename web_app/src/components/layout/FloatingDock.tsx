"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeProvider";

const NAV_ITEMS = [
  {
    name: "Overview",
    path: "/dashboard",
    desc: "Your health summary",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    gradient: "from-cyan-500 to-teal-500",
    glow: "shadow-cyan-400/30",
    badge: null,
  },
  {
    name: "Analyze",
    path: "/dashboard/analyze",
    desc: "Upload & scan reports",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-400/30",
    badge: "AI",
  },
  {
    name: "History",
    path: "/dashboard/history",
    desc: "Past reports & trends",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-blue-500 to-cyan-600",
    glow: "shadow-blue-400/30",
    badge: null,
  },
  {
    name: "Doctors",
    path: "/dashboard/doctors",
    desc: "Find specialists near you",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    gradient: "from-rose-500 to-pink-600",
    glow: "shadow-rose-400/30",
    badge: null,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    desc: "Account & preferences",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    gradient: "from-slate-500 to-gray-600",
    glow: "shadow-gray-400/20",
    badge: null,
  },
];

const PAGE_NAMES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/analyze": "Analyze",
  "/dashboard/analyze/liver": "Liver Analysis",
  "/dashboard/history": "History",
  "/dashboard/doctors": "Doctors",
  "/dashboard/settings": "Settings",
};

export default function CommandLauncher() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const currentPage =
    PAGE_NAMES[pathname] ??
    Object.entries(PAGE_NAMES)
      .reverse()
      .find(([k]) => pathname.startsWith(k))?.[1] ??
    "Dashboard";

  const initials = user?.name
    ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleNavigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push("/");
  };

  return (
    <>
      {/* ── Launcher Trigger Pill (fixed bottom-center) ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className={`
            flex items-center gap-3 px-4 py-2.5 rounded-full
            bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl
            border border-white dark:border-white/10
            shadow-2xl shadow-gray-300/40 dark:shadow-black/50
            hover:shadow-cyan-200/30 dark:hover:shadow-cyan-900/30
            transition-all duration-300 hover:scale-105 active:scale-95
            group
          `}
        >
          {/* Grid icon */}
          <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white shrink-0 group-hover:rotate-90 transition-transform duration-300">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
              <circle cx="3" cy="3" r="2"/><circle cx="8" cy="3" r="2"/><circle cx="13" cy="3" r="2"/>
              <circle cx="3" cy="8" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="13" cy="8" r="2"/>
              <circle cx="3" cy="13" r="2"/><circle cx="8" cy="13" r="2"/><circle cx="13" cy="13" r="2"/>
            </svg>
          </span>

          {/* Current page name */}
          <span className="text-sm font-bold font-poppins text-gray-700 dark:text-gray-200 whitespace-nowrap">
            {currentPage}
          </span>

          {/* Chevron up */}
          <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* ── Full-screen Overlay Launcher ── */}
      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col">

          {/* Blurred Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          {/* Sheet sliding up from bottom */}
          <div className="relative mt-auto w-full animate-launcher-up">
            <div className="bg-white/95 dark:bg-slate-950/98 backdrop-blur-3xl rounded-t-[2.5rem] border-t border-white/60 dark:border-white/10 shadow-2xl px-5 pt-5 pb-8 sm:px-8 sm:pt-7 sm:pb-10">

              {/* Handle */}
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-white/20 mx-auto mb-6" />

              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                {/* Logo */}
                <Link href="/" onClick={() => setOpen(false)}>
                  <Image
                    src="/assets/logo.png"
                    alt="DiagHeal"
                    width={88}
                    height={26}
                    className="object-contain dark:brightness-0 dark:invert"
                  />
                </Link>

                {/* Right controls */}
                <div className="flex items-center gap-2">
                  {/* Theme */}
                  <button
                    onClick={toggleTheme}
                    className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:text-cyan-700 dark:hover:text-cyan-400 transition"
                  >
                    {theme === "dark" ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    )}
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => setOpen(false)}
                    className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 hover:bg-gray-200 dark:hover:bg-white/15 hover:text-gray-700 dark:hover:text-gray-200 transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              {/* Navigation Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
                {NAV_ITEMS.map((item, i) => {
                  const isCurrentPage =
                    item.path === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname === item.path || pathname.startsWith(item.path + "/");

                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigate(item.path)}
                      className={`
                        relative flex flex-col items-center gap-3 p-4 sm:p-5 rounded-[1.5rem] border
                        transition-all duration-200 hover:scale-105 active:scale-95 text-center group
                        ${isCurrentPage
                          ? "bg-gradient-to-br " + item.gradient + " text-white border-transparent shadow-xl " + item.glow
                          : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-transparent hover:bg-gradient-to-br hover:" + item.gradient + " hover:text-white hover:shadow-xl hover:" + item.glow
                        }
                      `}
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      {/* AI Badge */}
                      {item.badge && (
                        <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-lg leading-tight shadow-sm">
                          {item.badge}
                        </span>
                      )}

                      {/* Active check */}
                      {isCurrentPage && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-white/50 ring-2 ring-white" />
                      )}

                      <span className={`transition-colors ${isCurrentPage ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-white"}`}>
                        {item.icon}
                      </span>

                      <div>
                        <p className={`font-bold font-poppins text-sm leading-tight ${isCurrentPage ? "text-white" : "text-gray-800 dark:text-gray-200 group-hover:text-white"}`}>
                          {item.name}
                        </p>
                        <p className={`text-[10px] font-barlow mt-0.5 leading-tight ${isCurrentPage ? "text-white/70" : "text-gray-400 dark:text-gray-500 group-hover:text-white/70"}`}>
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom: User + Sign out */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs font-poppins shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white font-poppins leading-tight">{user?.name ?? "User"}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-barlow">{user?.email ?? ""}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-poppins"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
