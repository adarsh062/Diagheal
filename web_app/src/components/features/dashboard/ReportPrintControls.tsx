"use client";

import React from "react";
import Link from "next/link";

export default function ReportPrintControls() {
    const handlePrint = () => {
        if (typeof window !== "undefined") {
            window.print();
        }
    };

    return (
        <>
            <div className="flex gap-2.5 flex-wrap no-print">
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition active:scale-95 shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Analysis
                </button>
                <Link href="/dashboard/analyze/liver" 
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-gray-200 dark:shadow-none transition active:scale-95 hover:-translate-y-0.5">
                    New Scan
                </Link>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print, nav, aside, header .no-print { display: none !important; }
                    body { background: white !important; margin: 0 !important; padding: 0 !important; -webkit-print-color-adjust: exact !important; }
                    main { margin: 0 !important; padding: 2rem !important; width: 100% !important; max-width: 100% !important; }
                    .grid { display: block !important; }
                    .lg\\:col-span-2, .space-y-5 { width: 100% !important; }
                    .bg-white\\/70, .bg-cyan-600 { border: 1px solid #eee !important; box-shadow: none !important; margin-bottom: 2rem !important; background: white !important; }
                    table { font-size: 10pt !important; width: 100% !important; }
                    th, td { border-bottom: 1px solid #eee !important; padding: 8px !important; }
                    .rounded-\\[2rem\\], .rounded-\\[2.5rem\\] { border-radius: 8px !important; }
                }
            ` }} />
        </>
    );
}
