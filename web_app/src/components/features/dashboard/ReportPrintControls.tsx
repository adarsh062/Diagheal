"use client";

import React from "react";

export default function ReportPrintControls() {
    return (
        <button 
            onClick={() => typeof window !== "undefined" && window.print()}
            className="no-print px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-[11px] uppercase tracking-widest rounded-full hover:bg-slate-800 transition active:scale-95"
        >
            Print
        </button>
    );
}
