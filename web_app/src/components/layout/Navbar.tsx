"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleProtectedNav = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(isLoggedIn ? "/dashboard" : "/login");
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  // Avatar initials from name
  const initials = user?.name
    ? user.name.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const navLinks = [
    { label: "HOME", href: "/", exact: true },
    { label: "ABOUT", href: "/about", exact: true },
    { label: "CONTACT", href: "/contact", exact: true },
  ];

  // Hide navbar on dashboard pages — but SHOW it on the settings page
  const isSettingsPage = pathname === "/dashboard/settings" || pathname.startsWith("/dashboard/settings/");
  if (pathname.startsWith("/dashboard") && !isSettingsPage) return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-dark-bg/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}>
        <div className="flex items-center justify-between px-5 md:px-8 max-w-7xl mx-auto">

          <Link href="/" className="shrink-0">
            <Image src="/assets/logo.png" alt="DiagHeal" width={100} height={32} className="object-contain cursor-pointer dark:brightness-0 dark:invert transition-all" priority />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-8 font-barlow tracking-widest text-neutral-950 dark:text-gray-100 text-sm font-bold">
            {navLinks.map(({ label, href, exact }) => (
              <Link key={label} href={href}
                className={`relative group transition-colors duration-300 ${(exact ? pathname === href : pathname.startsWith(href)) ? "text-cyan-700 dark:text-cyan-400" : "hover:text-cyan-700 dark:hover:text-cyan-400"}`}>
                {label}
                <span className={`absolute left-0 -bottom-1 h-[2px] bg-cyan-700 dark:bg-cyan-400 transition-all duration-300 ${(exact ? pathname === href : pathname.startsWith(href)) ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            ))}
            <a href="/dashboard" onClick={handleProtectedNav}
              className={`cursor-pointer relative group transition-colors duration-300 ${pathname.startsWith("/dashboard") ? "text-cyan-700 dark:text-cyan-400" : "hover:text-cyan-700 dark:hover:text-cyan-400"}`}>
              ANALYZE
              <span className={`absolute left-0 -bottom-1 h-[2px] bg-cyan-700 dark:bg-cyan-400 transition-all duration-300 ${pathname.startsWith("/dashboard") ? "w-full" : "w-0 group-hover:w-full"}`} />
            </a>
          </div>

          {/* Right side auth */}
          <div className="flex items-center gap-3 font-barlow tracking-widest font-bold text-sm">
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 border-2 border-white dark:border-slate-700 shadow-md flex items-center justify-center text-white hover:scale-105 transition"
                >
                  <span className="font-poppins font-bold text-sm">{initials}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white dark:border-slate-600 rounded-2xl shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Signed in as</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-cyan-50 dark:hover:bg-slate-700 hover:text-cyan-700 dark:hover:text-cyan-400 transition" onClick={() => setProfileOpen(false)}>Dashboard</Link>
                    <Link href="/dashboard/settings" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-cyan-50 dark:hover:bg-slate-700 hover:text-cyan-700 dark:hover:text-cyan-400 transition" onClick={() => setProfileOpen(false)}>Settings</Link>
                    <div className="border-t border-gray-100 dark:border-slate-700 mt-1">
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden md:block text-black dark:text-gray-100 hover:text-cyan-700 dark:hover:text-cyan-400 transition text-sm">LOGIN</Link>
                <Link href="/signup"
                  className={`px-5 py-2 border-2 border-black dark:border-gray-300 dark:text-gray-100 rounded-full transition-all duration-300 text-sm font-bold ${scrolled ? "hover:bg-cyan-600 hover:border-cyan-600 hover:text-white dark:hover:bg-cyan-600 dark:hover:border-cyan-600 dark:hover:text-white" : "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"}`}>
                  SIGN UP
                </Link>
              </>
            )}

            {/* Mobile Hamburger (only for non-dashboard pages on mobile) */}
            {!pathname.startsWith("/dashboard") && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && !pathname.startsWith("/dashboard") && (
          <div className="md:hidden bg-white/95 dark:bg-slate-900/97 backdrop-blur-xl border-t border-gray-100 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
            <div className="px-5 py-4 space-y-1">
              {navLinks.map(({ label, href, exact }) => (
                <Link key={label} href={href}
                  className={`block px-4 py-3 rounded-xl font-barlow font-bold text-base tracking-widest transition-colors ${(exact ? pathname === href : pathname.startsWith(href)) ? "text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"}`}>
                  {label}
                </Link>
              ))}
              <button onClick={handleProtectedNav}
                className="w-full text-left block px-4 py-3 rounded-xl font-barlow font-bold text-base tracking-widest text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                ANALYZE
              </button>
              {!isLoggedIn && (
                <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                  <Link href="/login" className="block px-4 py-3 rounded-xl font-barlow font-bold text-sm tracking-widest text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">LOGIN</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}