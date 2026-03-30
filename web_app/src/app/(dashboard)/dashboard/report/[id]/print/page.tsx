export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";

interface PrintReportPageProps {
    params: { id: string };
}

export default async function PrintReportPage({ params }: PrintReportPageProps) {
    const { id } = await params;

    const record = await prisma.record.findUnique({
        where: { id },
        include: { user: true }
    });

    if (!record) {
        return notFound();
    }

    const biomarkers = [
        { label: "Total Bilirubin", value: record.tb, unit: "mg/dL", normal: "0.1 - 1.2" },
        { label: "Direct Bilirubin", value: record.db, unit: "mg/dL", normal: "0 - 0.3" },
        { label: "Alkaline Phosphatase", value: record.alkphos, unit: "U/L", normal: "44 - 147" },
        { label: "SGPT (ALT)", value: record.sgpt, unit: "U/L", normal: "7 - 55" },
        { label: "SGOT (AST)", value: record.sgot, unit: "U/L", normal: "8 - 48" },
        { label: "Total Protein", value: record.tp, unit: "g/dL", normal: "6.0 - 8.3" },
        { label: "Albumin", value: record.alb, unit: "g/dL", normal: "3.4 - 5.4" },
        { label: "A/G Ratio", value: record.agRatio, unit: "", normal: "1.1 - 2.5" },
    ];

    const isAbnormal = record.prediction === 1;

    return (
        <div className="min-h-screen bg-white p-8 max-w-4xl mx-auto font-sans text-slate-900 border-x border-slate-100">
            {/* Header / Letterhead */}
            <header className="flex justify-between items-center border-b-4 border-cyan-600 pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-cyan-700 tracking-tighter">DIAGHEAL AI</h1>
                    <p className="text-[10px] font-bold text-slate-400 tracking-[0.4em] uppercase mt-1">Advanced Diagnostic Systems</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Medical Health Report</p>
                    <p className="text-sm font-black mt-1">ID: {record.id.toUpperCase()}</p>
                    <p className="text-xs text-slate-400 font-medium">Generated on {new Date(record.createdAt).toLocaleString("en-IN")}</p>
                </div>
            </header>

            {/* Patient Info Section */}
            <section className="bg-slate-50 p-6 rounded-2xl grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10 border border-slate-100">
                <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-2">Patient Name</p>
                    <p className="text-sm font-black">{record.user.name || "N/A"}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-2">Email Address</p>
                    <p className="text-sm font-black">{record.user.email}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-2">Age / Gender</p>
                    <p className="text-sm font-black">{record.age || "--"} / {record.gender || "--"}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-2">Test Type</p>
                    <p className="text-sm font-black uppercase">{record.type} ANALYSIS</p>
                </div>
            </section>

            {/* Biomarkers Table */}
            <section className="mb-10">
                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-cyan-600 rounded-full" />
                    Biomarker Values
                </h3>
                <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Parameter</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Observed Value</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Unit</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Normal Range</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {biomarkers.map((bio) => (
                                <tr key={bio.label} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{bio.label}</td>
                                    <td className="px-6 py-4 text-sm font-black text-slate-900 text-center">{bio.value ?? "--"}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-400 text-center italic">{bio.unit}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500 text-right opacity-60 font-mono tracking-tighter">{bio.normal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Prediction and AI Summary */}
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
                {/* Prediction Result */}
                <section className={`p-8 rounded-[2rem] border ${isAbnormal ? 'bg-orange-50/50 border-orange-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-black text-slate-800">Final Diagnostic</h3>
                        <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isAbnormal ? 'bg-orange-600 text-white' : 'bg-emerald-600 text-white'}`}>
                            {isAbnormal ? "Check Required" : "Status Normal"}
                        </div>
                    </div>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed mb-6">
                        Our ML Engine predicts a <span className="font-black text-slate-900">{(record.confidence * 100).toFixed(1)}% confidence</span> level for this assessment.
                    </p>
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isAbnormal ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {isAbnormal ? "🚨" : "✅"}
                        </div>
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">
                            {isAbnormal ? "Early signs of liver stress detected." : "No significant abnormalities found."}
                        </p>
                    </div>
                </section>

                {/* AI Summary */}
                <section className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/20 rounded-full blur-3xl -translate-y-16 translate-x-16" />
                    <h3 className="text-xl font-black mb-4 relative z-10">AI Executive Summary</h3>
                    <p className="text-sm text-slate-300 font-medium leading-relaxed italic relative z-10">
                        {record.summary || "No specific summary available for this scan. Always consult a certified medical practitioner for finalized clinical decisions."}
                    </p>
                </section>
            </div>

            {/* Recommendations / Next Steps */}
            <section className="border-t border-slate-100 pt-10">
                <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-10 h-0.5 bg-slate-900 rounded-full" />
                    Recommended Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {record.recommendations && typeof record.recommendations === 'object' && Array.isArray(record.recommendations) ? (
                        (record.recommendations as string[]).map((rec, i) => (
                            <div key={i} className="flex gap-4 p-4 border border-slate-50 rounded-2xl">
                                <span className="text-cyan-600 font-black">#{i+1}</span>
                                <p className="text-[13px] font-bold text-slate-600">{rec}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm font-bold text-slate-400">Regular self-monitoring and hydration is advised.</p>
                    )}
                </div>
            </section>

            {/* Footer / Disclaimer */}
            <footer className="mt-20 pt-12 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-4">DIAGHEAL ADVANCED DIAGNOSTICS</p>
                <div className="max-w-[480px] mx-auto opacity-40">
                    <p className="text-[8px] font-bold text-slate-500 uppercase leading-relaxed">
                        Disclaimer: This report is generated by AI (Gemini 1.5 Pro) and machine learning models. It is NOT a clinical diagnosis. Always consult with a registered medical practitioner before taking any medical action or lifestyle changes. Diagheal Inc. is not liable for errors or medical decisions based on this report.
                    </p>
                </div>
                <div className="mt-12 flex justify-center gap-4 no-print">
                    <button 
                        onClick={() => typeof window !== 'undefined' && window.print()}
                        className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                    >
                        Confirm & Print
                    </button>
                </div>
            </footer>

            {/* Auto Print Script for Client */}
            <script dangerouslySetInnerHTML={{ __html: `
                if (typeof window !== 'undefined') {
                    window.onload = function() {
                        // Optional: window.print();
                    };
                }
            ` }} />

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none; }
                    body { -webkit-print-color-adjust: exact; padding: 0 !important; }
                    .min-h-screen { min-height: auto; }
                    .max-w-4xl { max-width: 100%; border: none; }
                }
            ` }} />
        </div>
    );
}
