import Link from "next/link";

const organs = [
    {
        name: "Liver Scan",
        description: "Analyze LFT reports to detect early signs of fatty liver, cirrhosis, or inflammation.",
        href: "/dashboard/analyze/liver",
        locked: false,
        color: "cyan",
        badge: "Active",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        bgIcon: (
            <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-1.07 3.97-2.9 5.4z" />
            </svg>
        ),
    },
    {
        name: "Kidney Care",
        description: "KFT analysis for creatinine, urea, and electrolyte levels to assess kidney function.",
        href: "#",
        locked: true,
        color: "violet",
        badge: "Coming Soon",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        ),
        bgIcon: (
            <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        ),
    },
    {
        name: "Heart Health",
        description: "Cardiac risk profiling using ECG data, cholesterol levels, and blood pressure metrics.",
        href: "#",
        locked: true,
        color: "rose",
        badge: "Coming Soon",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        bgIcon: (
            <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
    },
    {
        name: "Brain MRI",
        description: "Neural pattern analysis to screen for early markers of cognitive decline and anomalies.",
        href: "#",
        locked: true,
        color: "amber",
        badge: "Coming Soon",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        bgIcon: (
            <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
    },
    {
        name: "Lung Scan",
        description: "Pulmonary function assessment using chest X-ray patterns and spirometry data.",
        href: "#",
        locked: true,
        color: "teal",
        badge: "Coming Soon",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
        ),
        bgIcon: (
            <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
        ),
    },
    {
        name: "Diabetes Check",
        description: "HbA1c and glucose trend analysis for early diabetes detection and management.",
        href: "#",
        locked: true,
        color: "orange",
        badge: "Coming Soon",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        ),
        bgIcon: (
            <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
        ),
    },
];

const colorMap: Record<string, { icon: string; badge: string; ring: string; glow: string; bg: string }> = {
    cyan: { icon: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400", badge: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300", ring: "text-cyan-600 dark:text-cyan-400", glow: "hover:shadow-cyan-200/60 dark:hover:shadow-cyan-500/10", bg: "hover:bg-white/90 dark:hover:bg-slate-800/60" },
    violet: { icon: "bg-violet-100 dark:bg-violet-900/30 text-violet-500 dark:text-violet-400", badge: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300", ring: "text-violet-500 dark:text-violet-400", glow: "", bg: "" },
    rose: { icon: "bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400", badge: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300", ring: "text-rose-500 dark:text-rose-400", glow: "", bg: "" },
    amber: { icon: "bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400", badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300", ring: "text-amber-500 dark:text-amber-400", glow: "", bg: "" },
    teal: { icon: "bg-teal-100 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400", badge: "bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300", ring: "text-teal-500 dark:text-teal-400", glow: "", bg: "" },
    orange: { icon: "bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400", badge: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300", ring: "text-orange-500 dark:text-orange-400", glow: "", bg: "" },
};

export default function AnalyzeHubPage() {
    return (
        <main className="w-full">
            <header className="dash-header mb-10">
                <h1 className="text-3xl md:text-4xl font-poppins font-semibold text-black dark:text-white mb-2">
                    Analyze Report
                </h1>
                <p className="text-gray-600 dark:text-gray-300 font-barlow tracking-wide">
                    Select a health module below to begin your AI-powered diagnosis.
                </p>
            </header>

            {/* Grid of organ cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {organs.map((organ) => {
                    const c = colorMap[organ.color];

                    if (!organ.locked) {
                        // ── UNLOCKED card ──
                        return (
                            <Link
                                key={organ.name}
                                href={organ.href}
                                className={`dash-card group relative bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border border-white/80 dark:border-slate-600 rounded-[2.5rem] p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${c.glow} ${c.bg} cursor-pointer overflow-hidden`}
                                style={{ "--delay": `${organs.indexOf(organ) * 0.07}s` } as React.CSSProperties}
                            >
                                {/* Decorative bg icon */}
                                <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity ${c.ring}`}>
                                    {organ.bgIcon}
                                </div>

                                {/* Badge */}
                                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-5 ${c.badge}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                    {organ.badge}
                                </span>

                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${c.icon}`}>
                                    {organ.icon}
                                </div>

                                <h3 className="text-2xl font-poppins font-bold text-gray-900 dark:text-white mb-2">{organ.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-300 font-barlow leading-relaxed mb-6">{organ.description}</p>

                                <div className={`flex items-center gap-2 font-bold text-sm tracking-wide group-hover:gap-4 transition-all ${c.ring}`}>
                                    START ANALYSIS <span>→</span>
                                </div>
                            </Link>
                        );
                    }

                    // ── LOCKED card ──
                    return (
                        <div
                            key={organ.name}
                            className="dash-card relative bg-gray-50/50 dark:bg-slate-900/30 border border-white/40 dark:border-slate-700 rounded-[2.5rem] p-8 overflow-hidden cursor-not-allowed"
                            style={{ "--delay": `${organs.indexOf(organ) * 0.07}s` } as React.CSSProperties}
                        >
                            {/* Blur overlay */}
                            <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center gap-2 rounded-[2.5rem]">
                                <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-md">
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 font-barlow tracking-widest uppercase">Coming Soon</span>
                            </div>

                            {/* Faded card content behind overlay */}
                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-5 opacity-40 ${colorMap[organ.color].badge}`}>
                                {organ.badge}
                            </span>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 opacity-40 ${colorMap[organ.color].icon}`}>
                                {organ.icon}
                            </div>
                            <h3 className="text-2xl font-poppins font-bold text-gray-400 dark:text-gray-600 mb-2">{organ.name}</h3>
                            <p className="text-sm text-gray-400 dark:text-gray-600 font-barlow leading-relaxed mb-6">{organ.description}</p>
                            <div className="flex items-center gap-2 font-bold text-sm tracking-wide text-gray-400 dark:text-gray-600">
                                START ANALYSIS <span>→</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
