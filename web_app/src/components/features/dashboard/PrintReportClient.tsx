"use client";

import React from "react";
import { Activity } from "lucide-react";

interface Biomarker {
    label: string;
    value: number | null;
    unit: string;
    normal: string;
}

interface PrintReportClientProps {
    record: any;
    biomarkers: Biomarker[];
}

export default function PrintReportClient({ record, biomarkers }: PrintReportClientProps) {
    const handlePrint = () => {
        if (typeof window !== "undefined") {
            window.print();
        }
    };

    const reportDate = record.createdAt ? new Date(record.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

    return (
        <div className="min-h-screen bg-white text-slate-950 p-6 md:p-12 font-sans">
            {/* Header / Controls - Hidden on Print */}
            <div className="max-w-3xl mx-auto flex justify-between items-center mb-8 pb-4 border-b no-print">
                <button 
                    onClick={() => window.history.back()}
                    className="text-sm font-bold text-slate-500 hover:text-slate-900 transition"
                >
                    ← Back
                </button>
                <button 
                    onClick={handlePrint}
                    className="bg-slate-950 text-white px-8 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition shadow-lg active:scale-95"
                >
                    Print Analysis
                </button>
            </div>

            {/* The Report Document */}
            <div className="max-w-3xl mx-auto space-y-12 print:space-y-10">
                
                {/* Branding & Patient Info */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Activity className="text-slate-900" size={24} />
                            <span className="text-2xl font-bold tracking-tighter uppercase">DIAGHEAL</span>
                        </div>
                        <h1 className="text-4xl font-black uppercase leading-none">Liver Analysis<br/>Report</h1>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date: {reportDate} | Record: #{record.id.slice(0, 12)}</p>
                    </div>
                    <div className="text-right space-y-2 pt-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Identification</p>
                        <h3 className="text-xl font-bold">{record.user?.name || "Patient"}</h3>
                        <p className="text-sm text-slate-500">{record.user?.email}</p>
                        <div className={`mt-4 inline-block px-3 py-1 text-[10px] font-black uppercase border-2 ${
                            record.prediction === 0 ? "border-green-600 text-green-600" : "border-red-600 text-red-600"
                        }`}>
                            Result: {record.prediction === 0 ? "STABLE / NORMAL" : "ACTION REQUIRED"}
                        </div>
                    </div>
                </div>

                {/* Biomarker Table */}
                <div className="space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-2">Biokinetic Vitals</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b">
                                <th className="py-2">Test Description</th>
                                <th className="py-2 text-right">Result</th>
                                <th className="py-2 text-right">Reference Range</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y border-b text-sm">
                            {biomarkers.map((bio, i) => (
                                <tr key={i}>
                                    <td className="py-4 font-bold">{bio.label}</td>
                                    <td className="py-4 text-right font-black">{bio.value ?? "--"} <span className="text-[10px] font-bold text-slate-400 uppercase">{bio.unit}</span></td>
                                    <td className="py-4 text-right text-slate-500">{bio.normal} {bio.unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Analysis Block */}
                <div className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-2">Clinical Logic Summary</h2>
                    <div className="bg-slate-50 border border-slate-100 p-8 text-sm leading-relaxed italic text-slate-700 print:bg-white print:border-slate-200">
                        {record.analysis || "No automated summary available for this record."}
                    </div>
                </div>

                {/* Safety & Disclaimer */}
                <div className="pt-10 space-y-4 opacity-60">
                    <p className="text-[9px] font-black uppercase tracking-widest">Medical Disclaimer</p>
                    <p className="text-[10px] leading-relaxed max-w-2xl">
                        This document is a computer-generated analysis based on submitted biomarkers. Diagheal provides patterns and predictions for informational use only. This is not a substitute for clinical diagnostics or consultation with a medical professional.
                    </p>
                    <div className="flex justify-between items-center pt-8 text-[8px] font-bold uppercase tracking-[0.3em]">
                        <span>Secure Digital Record</span>
                        <span>Diagheal.cloud</span>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; margin: 0 !important; -webkit-print-color-adjust: exact; }
                    .max-w-3xl { max-width: 100% !important; margin: 0 !important; width: 100% !important; }
                    .bg-slate-50 { background-color: transparent !important; }
                }
            `}</style>
        </div>
    );
}
