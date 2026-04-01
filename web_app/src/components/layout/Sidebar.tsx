"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    name: "Analyze",
    path: "/dashboard/analyze",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    name: "History",
    path: "/dashboard/history",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname === path || pathname.startsWith(path + "/");
  };

  const initials = user?.name
    ? user.name.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    router.push("/");
  };

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 bg-white/80 dark:bg-slate-950/90 backdrop-blur-2xl border-r border-gray-100 dark:border-white/5 z-40 transition-[width] duration-300 ease-in-out shrink-0 ${
          isCollapsed ? "w-[64px]" : "w-[220px]"
        }`}
      >
        <div className={`flex items-center border-b border-gray-100 dark:border-white/5 px-3 h-14 shrink-0 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <Link href="/" className="hover:opacity-75 transition-opacity">
              <Image src="/assets/logo.png" alt="DiagHeal" width={88} height={26} className="object-contain dark:brightness-0 dark:invert" priority />
            </Link>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 transition shrink-0">
            <svg className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive(item.path) ? "bg-slate-900 text-white" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"} ${isCollapsed ? "justify-center" : ""}`}>
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="font-bold text-sm tracking-tight">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="px-2.5 pb-4 border-t border-gray-100 dark:border-white/5 pt-3">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl group">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">{initials}</div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate leading-tight dark:text-white uppercase tracking-tight">{user?.name}</p>
                <p className="text-[10px] text-gray-400 truncate leading-tight">{user?.email}</p>
              </div>
            )}
            {!isCollapsed && (
              <button onClick={handleLogout} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION - Ultra Minimal White Glass */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[320px] no-print">
        <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl border border-gray-100 dark:border-white/10 rounded-full shadow-2xl px-5 py-2 flex items-center justify-between pointer-events-auto">
          {/* Back to Home */}
          <Link href="/" className="p-2 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          
          <Link href="/dashboard" className={`p-2 rounded-full transition-all ${pathname === "/dashboard" ? "bg-slate-900 text-white shadow-lg" : "text-gray-400 hover:bg-gray-100"}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </Link>

          <Link href="/dashboard/analyze" className={`p-2 rounded-full transition-all ${pathname.startsWith("/dashboard/analyze") ? "bg-slate-900 text-white shadow-lg" : "text-gray-400 hover:bg-gray-100"}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </Link>

          <Link href="/dashboard/history" className={`p-2 rounded-full transition-all ${pathname === "/dashboard/history" ? "bg-slate-900 text-white shadow-lg" : "text-gray-400 hover:bg-gray-100"}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>

          <button 
            onClick={() => setShowProfileMenu(true)} 
            className="w-9 h-9 rounded-full bg-slate-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white font-black text-[10px] shadow-lg active:scale-90 transition-all font-poppins"
          >
            {initials}
          </button>
        </div>
      </nav>

      {/* Profile Menu Overlay for Mobile */}
      {showProfileMenu && (
        <div className="fixed inset-0 z-[110] flex flex-col no-print">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowProfileMenu(false)} />
            <div className="relative mt-auto w-full bg-white dark:bg-slate-950 rounded-t-[2.5rem] p-8 shadow-2xl animate-launcher-up">
                <div className="w-12 h-1.5 rounded-full bg-gray-100 dark:bg-white/10 mx-auto mb-8" />
                
                <div className="space-y-3 mb-8">
                    <Link href="/dashboard/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 active:bg-gray-100 transition-all">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>
                            <span className="font-bold text-sm dark:text-white">Settings</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </Link>
                </div>

                <div className="flex items-center gap-4 mb-8 p-1">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xl">{initials}</div>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-black text-sm dark:text-white truncate uppercase tracking-tight">{user?.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                    </div>
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="w-full py-5 rounded-2xl bg-red-50 text-red-600 font-black text-sm uppercase tracking-widest active:bg-red-100 transition-all"
                >
                  Terminate Session
                </button>
            </div>
        </div>
      )}
    </>
  );
}