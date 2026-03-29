"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock Report Data
const REPORT_DATA = {
    id: "RPT-2026-001",
    date: "Feb 10, 2026",
    patientName: "Adarsh",
    age: 24,
    gender: "Male",
    doctor: "Dr. A. Sharma",
    status: "Review Required",
    score: 65,
    summary: "Elevated SGPT and SGOT levels indicating mild liver inflammation. Total Bilirubin is within normal range. Consider repeating LFT in 4 weeks and consult a gastroenterologist.",
    findings: [
        { name: "SGPT (ALT)", value: "55 U/L", status: "High",       range: "7–56 U/L" },
        { name: "SGOT (AST)", value: "48 U/L", status: "Borderline", range: "5–40 U/L" },
        { name: "Total Bilirubin", value: "0.8 mg/dL", status: "Normal", range: "0.1–1.2 mg/dL" },
        { name: "ALP",         value: "85 U/L", status: "Normal",    range: "44–147 U/L" },
    ],
    recommendations: [
        "Reduce alcohol consumption immediately.",
        "Avoid fatty and fried foods for at least 6 weeks.",
        "Repeat LFT after 4 weeks.",
        "Consult a gastroenterologist for further evaluation.",
    ],
};

const STATUS_STYLES: Record<string, string> = {
    Normal:     "bg-green-100  dark:bg-green-900/30  text-green-700  dark:text-green-400",
    High:       "bg-red-100    dark:bg-red-900/30    text-red-700    dark:text-red-400",
    Low:        "bg-blue-100   dark:bg-blue-900/30   text-blue-700   dark:text-blue-400",
    Borderline: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
};

function ScoreRing({ score }: { score: number }) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

    return (
        <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-slate-700" />
                <circle cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round" className="score-circle transition-all duration-1000" />
            </svg>
            <div className="absolute text-center">
                <span className="block text-2xl font-bold font-poppins text-gray-800 dark:text-white">{score}</span>
                <span className="block text-[10px] text-gray-400 font-barlow leading-tight">/ 100</span>
            </div>
        </div>
    );
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();

    return (
        <main className="w-full">
            {/* Header */}
            <header className="mb-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-2 font-barlow" aria-label="Breadcrumb">
                        <Link href="/dashboard" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Dashboard</Link>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <span className="text-gray-500 dark:text-gray-400">Report Details</span>
                    </nav>
                    <h1 className="text-2xl md:text-3xl font-poppins font-semibold text-black dark:text-white">Liver Function Test</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-barlow mt-0.5">Generated on {REPORT_DATA.date} · ID: {params.id || REPORT_DATA.id}</p>
                </div>
                <div className="flex gap-2.5 flex-wrap">
                    <button onClick={() => window.print()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition font-poppins">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download PDF
                    </button>
                    <button onClick={() => router.push("/dashboard/analyze/liver")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm transition font-poppins shadow-lg shadow-cyan-200/50 dark:shadow-none">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Re-Analyze
                    </button>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-5">

                {/* ── Main Column ── */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Score + Status Card */}
                    <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/80 dark:border-slate-700 rounded-[2rem] p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="flex flex-col items-center gap-1.5 shrink-0">
                                <ScoreRing score={REPORT_DATA.score} />
                                <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-800/40 font-poppins">
                                    {REPORT_DATA.status}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold font-poppins text-gray-800 dark:text-white mb-1">Liver Health Score</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-barlow mb-4">Based on biomarker analysis — higher is better</p>

                                {/* Score progress bar */}
                                <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-1000"
                                        style={{ width: `${REPORT_DATA.score}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-barlow text-gray-400">
                                    <span>0 — Critical</span>
                                    <span>50 — Moderate</span>
                                    <span>100 — Excellent</span>
                                </div>

                                {/* Quick stats */}
                                <div className="grid grid-cols-3 gap-3 mt-5">
                                    {[
                                        { label: "Age", value: `${REPORT_DATA.age} yrs` },
                                        { label: "Gender", value: REPORT_DATA.gender },
                                        { label: "Doctor", value: REPORT_DATA.doctor },
                                    ].map((s) => (
                                        <div key={s.label} className="bg-gray-50 dark:bg-slate-800 rounded-xl p-2.5 text-center">
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide font-barlow">{s.label}</p>
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 font-poppins truncate">{s.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Summary */}
                    <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/80 dark:border-slate-700 rounded-[2rem] p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold font-poppins shrink-0">AI</div>
                            <div>
                                <h3 className="text-base font-bold font-poppins text-gray-800 dark:text-white">Analysis Summary</h3>
                                <p className="text-xs text-gray-400 dark:text-gray-500 font-barlow">Generated by DiagHeal AI</p>
                            </div>
                        </div>
                        <div className="bg-cyan-50/70 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-800/30 rounded-2xl p-5">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-barlow text-sm">{REPORT_DATA.summary}</p>
                        </div>
                    </div>

                    {/* Findings Table */}
                    <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/80 dark:border-slate-700 rounded-[2rem] p-6 md:p-8 overflow-hidden">
                        <h3 className="text-base font-bold font-poppins text-gray-800 dark:text-white mb-5">Detailed Findings</h3>

                        {/* Mobile cards */}
                        <div className="sm:hidden space-y-3">
                            {REPORT_DATA.findings.map((item, idx) => (
                                <div key={idx} className="bg-gray-50/70 dark:bg-slate-800/50 rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="font-semibold text-gray-800 dark:text-white text-sm font-poppins">{item.name}</span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[item.status] ?? "bg-gray-100 text-gray-600"}`}>{item.status}</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 font-barlow font-bold">{item.value}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-barlow mt-0.5">Ref: {item.range}</p>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
                                        <th className="pb-3 font-semibold pl-2">Biomarker</th>
                                        <th className="pb-3 font-semibold">Result</th>
                                        <th className="pb-3 font-semibold">Reference</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="font-barlow">
                                    {REPORT_DATA.findings.map((item, idx) => (
                                        <tr key={idx} className="border-b border-gray-50 dark:border-slate-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="py-4 pl-2 font-semibold text-gray-800 dark:text-gray-200 text-sm">{item.name}</td>
                                            <td className="py-4 text-gray-700 dark:text-gray-300 font-bold text-sm">{item.value}</td>
                                            <td className="py-4 text-xs text-gray-400 dark:text-gray-500">{item.range}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[item.status] ?? "bg-gray-100 text-gray-600"}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ── Sidebar ── */}
                <div className="space-y-5">

                    {/* Recommendations */}
                    <div className="bg-gradient-to-br from-cyan-700 to-teal-700 text-white rounded-[2rem] p-7 shadow-xl shadow-cyan-200/30 dark:shadow-none relative overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                </div>
                                <h3 className="text-base font-bold font-poppins">Recommendations</h3>
                            </div>
                            <ul className="space-y-3">
                                {REPORT_DATA.recommendations.map((rec, i) => (
                                    <li key={i} className="flex gap-3 text-sm font-barlow leading-relaxed">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-300 flex-shrink-0" />
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Next Check-up */}
                    <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/80 dark:border-slate-700 rounded-[2rem] p-6">
                        <h3 className="text-base font-bold font-poppins text-gray-800 dark:text-white mb-1.5">Next Check-up</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-barlow mb-4">Recommended follow-up based on your results.</p>
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
                            <div className="text-center bg-white dark:bg-slate-700 p-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600 shrink-0">
                                <span className="block text-xs text-red-500 font-bold uppercase font-poppins">Mar</span>
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white font-poppins leading-none mt-0.5">10</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white text-sm font-poppins">Liver Function Test</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-barlow">Scheduled — 4 weeks out</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30 rounded-[2rem] p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">💡</span>
                            <h3 className="text-base font-bold font-poppins text-amber-800 dark:text-amber-300">Health Tips</h3>
                        </div>
                        <ul className="space-y-2.5 text-sm font-barlow text-amber-700 dark:text-amber-400">
                            {["Drink 8+ glasses of water daily", "Exercise at least 30 min/day", "Avoid processed foods", "Sleep 7–8 hours nightly"].map((tip, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
