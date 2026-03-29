"use client";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const router = useRouter();

    const initials = user?.name
        ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <main className="min-h-screen bg-[#f2f2eb] dark:bg-dark-bg transition-colors duration-300 pb-16 pt-16 md:pt-0">

            {/* ── Background Blobs ── */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-teal-400 blur-[120px] opacity-20 dark:opacity-10 pointer-events-none -translate-y-1/4 translate-x-1/4" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600 blur-[120px] opacity-15 dark:opacity-10 pointer-events-none translate-y-1/4 -translate-x-1/4" />

            {/* ── Mobile-only top bar (Back to Dashboard) ── */}
            {/* This appears below the Navbar on mobile since Navbar is fixed at top */}
            <div className="md:hidden sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700/80 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors font-poppins"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Dashboard
                    </Link>
                    <span className="text-sm font-bold text-gray-800 dark:text-white font-poppins">Settings</span>
                    <Link
                        href="/"
                        className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline font-poppins"
                    >
                        Home
                    </Link>
                </div>
            </div>

            {/* ── Page Content ── */}
            {/* pt-28 on desktop (Navbar height), pt-4 on mobile (mobile bar above handles spacing) */}
            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6 md:pt-24">

                {/* Desktop header */}
                <header className="mb-8 hidden md:block">
                    <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500 mb-3 font-barlow">
                        <Link href="/dashboard" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-poppins font-semibold text-black dark:text-white mb-1.5">Account Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-barlow text-sm">Manage your profile and preferences.</p>
                </header>

                {/* Mobile header (below the sticky top bar) */}
                <header className="mb-6 md:hidden">
                    <h1 className="text-2xl font-poppins font-semibold text-black dark:text-white mb-1">Account Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-barlow text-sm">Manage your profile and preferences.</p>
                </header>

                <div className="space-y-5">

                    {/* ── Profile Section ── */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-sm">
                        <h3 className="text-base font-bold font-poppins mb-5 text-gray-900 dark:text-gray-100">Profile Information</h3>
                        <div className="flex items-center gap-4 mb-7">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-md font-poppins shrink-0">
                                {initials}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white font-poppins">{user?.name ?? "User"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-barlow mb-2">{user?.email ?? ""}</p>
                                <Button variant="outline" className="text-xs !py-1.5 !px-4 dark:border-gray-600 dark:text-gray-300">Change Avatar</Button>
                            </div>
                        </div>
                        <form className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">First Name</label>
                                    <input type="text" defaultValue={user?.name?.split(" ")[0] ?? "User"}
                                        className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">Last Name</label>
                                    <input type="text" defaultValue={user?.name?.split(" ")[1] ?? ""}
                                        className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">Email Address</label>
                                <input type="email" defaultValue={user?.email ?? ""}
                                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-sm" />
                            </div>
                            <div className="flex justify-end pt-1">
                                <Button className="!py-2.5 !px-6 text-sm">Save Changes</Button>
                            </div>
                        </form>
                    </div>

                    {/* ── Preferences ── */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-sm">
                        <h3 className="text-base font-bold font-poppins mb-5 text-gray-900 dark:text-gray-100">Preferences</h3>
                        <div className="space-y-3">
                            {/* Email Notifications toggle */}
                            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                                <div>
                                    <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm font-poppins">Email Notifications</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-barlow mt-0.5">Receive report summaries via email</p>
                                </div>
                                <div className="w-12 h-6 bg-cyan-500 rounded-full relative cursor-pointer shrink-0">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>

                            {/* Dark Mode toggle */}
                            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                                <div>
                                    <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm font-poppins">Dark Mode</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-barlow mt-0.5">Switch between light and dark theme</p>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shrink-0 ${theme === "dark" ? "bg-cyan-500" : "bg-gray-300"}`}
                                    aria-label="Toggle Dark Mode"
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Quick Navigation (Mobile-friendly) ── */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-sm">
                        <h3 className="text-base font-bold font-poppins mb-4 text-gray-900 dark:text-gray-100">Quick Navigation</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { label: "Dashboard", href: "/dashboard", icon: "📊" },
                                { label: "Analyze", href: "/dashboard/analyze", icon: "⚡" },
                                { label: "History", href: "/dashboard/history", icon: "📋" },
                                { label: "Home", href: "/", icon: "🏠" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:border-cyan-200 dark:hover:border-cyan-700/40 transition-all hover:-translate-y-0.5 text-center"
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 font-poppins">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ── Sign Out (Mobile prominent) ── */}
                    <div className="md:hidden bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-[2rem] p-5 shadow-sm">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 font-bold font-poppins text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>

                    {/* ── Danger Zone ── */}
                    <div className="bg-red-50/60 dark:bg-red-900/10 backdrop-blur-xl border border-red-100 dark:border-red-900/30 rounded-[2rem] p-6 md:p-8 shadow-sm">
                        <h3 className="text-base font-bold font-poppins mb-1.5 text-red-700 dark:text-red-400">Danger Zone</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 font-barlow">These actions are irreversible. Please proceed with caution.</p>
                        <button className="px-6 py-2.5 rounded-full border-2 border-red-400 dark:border-red-500 text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-500 hover:text-white dark:hover:bg-red-500/20 transition-all font-poppins">
                            Delete Account
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}
