export default function DashboardPage() {
    return (
        <main className="w-full space-y-5">
            <header className="dash-header">
                <h1 className="text-2xl md:text-3xl font-poppins font-semibold text-black dark:text-white mb-1.5">My Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 font-barlow tracking-wide text-sm">Welcome back. Here is your health overview.</p>
            </header>

            {/* ── Quick Action Cards ── */}
            <div
                className="dash-card grid grid-cols-2 sm:grid-cols-4 gap-3"
                style={{ "--delay": "0.05s" } as React.CSSProperties}
            >
                {[
                    { label: "Total Reports", value: "2", icon: "📄", color: "cyan" },
                    { label: "Action Needed", value: "1", icon: "⚠️", color: "amber" },
                    { label: "Normal Results", value: "1", icon: "✅", color: "green" },
                    { label: "Doctors Saved", value: "3", icon: "👨‍⚕️", color: "violet" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border border-white/80 dark:border-slate-600 rounded-2xl p-4 text-center">
                        <span className="text-2xl block mb-1">{stat.icon}</span>
                        <p className="text-2xl font-bold font-poppins text-gray-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-barlow mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Recent Activities ── */}
            <div
                className="dash-card bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border border-white/80 dark:border-slate-600 rounded-[2rem] p-6 md:p-8 shadow-sm"
                style={{ "--delay": "0.10s" } as React.CSSProperties}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-poppins font-bold text-gray-900 dark:text-white">Recent Activities</h2>
                    <a href="/dashboard/history" className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline font-barlow tracking-wide">View All →</a>
                </div>

                <div className="space-y-3">
                    {/* History Item 1 */}
                    <div
                        className="dash-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-600 p-4 rounded-2xl hover:border-cyan-200 dark:hover:border-cyan-500/50 hover:-translate-y-0.5 transition-all duration-200"
                        style={{ "--delay": "0.15s" } as React.CSSProperties}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-700 dark:text-cyan-400 shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-white text-sm font-poppins">Liver Scan Analysis</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-barlow">ID: RPT-2026-001 · Feb 10, 2026</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pl-14 sm:pl-0">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 uppercase tracking-wide">Action Needed</span>
                            <a href="/dashboard/report/RPT-2026-001" className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline font-poppins">View →</a>
                        </div>
                    </div>

                    {/* History Item 2 */}
                    <div
                        className="dash-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-600 p-4 rounded-2xl hover:border-cyan-200 dark:hover:border-cyan-500/50 hover:-translate-y-0.5 transition-all duration-200"
                        style={{ "--delay": "0.22s" } as React.CSSProperties}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-white text-sm font-poppins">Kidney Check</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-barlow">ID: RPT-2025-098 · Dec 22, 2025</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pl-14 sm:pl-0">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 uppercase tracking-wide">Normal</span>
                            <a href="/dashboard/report/RPT-2025-098" className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline font-poppins">View →</a>
                        </div>
                    </div>
                </div>

                {/* Start new */}
                <div
                    className="dash-card mt-6"
                    style={{ "--delay": "0.30s" } as React.CSSProperties}
                >
                    <a href="/dashboard/analyze"
                        className="flex items-center justify-center gap-2.5 w-full sm:w-auto sm:inline-flex px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-full hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-lg shadow-cyan-200/50 dark:shadow-none font-poppins text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Start New Analysis
                    </a>
                </div>
            </div>

            {/* ── Health Tips Banner ── */}
            <div
                className="dash-card bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/20 border border-cyan-100 dark:border-cyan-800/30 rounded-[2rem] p-6 md:p-8"
                style={{ "--delay": "0.35s" } as React.CSSProperties}
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-2xl shrink-0">🧬</div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white font-poppins mb-0.5">Did you know?</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-barlow">Elevated SGPT levels can be an early indicator of liver stress — even before symptoms appear. Regular LFT screening is key to early detection.</p>
                    </div>
                    <a href="/dashboard/analyze/liver"
                        className="whitespace-nowrap px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full text-sm transition font-poppins shrink-0">
                        Check Now
                    </a>
                </div>
            </div>
        </main>
    );
}
