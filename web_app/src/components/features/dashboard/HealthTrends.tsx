"use client";

import React, { useState } from "react";
import { MoveUpRight, MoveDownRight, Minus, Leaf, Activity, ArrowRight } from "lucide-react";
import Link from 'next/link'


interface RecordData {
    id: string;
    type: string;
    prediction: number;
    tb: number | null;
    db: number | null;
    alkphos: number | null;
    sgpt: number | null;
    sgot: number | null;
    tp: number | null;
    alb: number | null;
    agRatio: number | null;
    createdAt: Date;
}

interface HealthTrendsProps {
    latestRecord: RecordData | null;
    previousRecord: RecordData | null;
}

export default function HealthTrends({ latestRecord, previousRecord }: HealthTrendsProps) {
    const [selectedType, setSelectedType] = useState("LIVER");

    if (!latestRecord) {
        return (
            <div className="group relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-[2.5rem] p-10 text-center shadow-2xl shadow-slate-200/50 dark:shadow-none h-full flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-inner">📉</div>
                <h3 className="text-2xl font-poppins font-bold text-slate-900 dark:text-white mb-3">Health Trajectory</h3>
                <p className="text-slate-500 dark:text-slate-400 font-barlow text-sm max-w-[240px] leading-relaxed">
                    Once you perform your first automated scan, we'll map your health journey here.
                </p>
                <Link href="/dashboard/analyze" className="mt-8 px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-2xl text-xs font-poppins transition-all shadow-lg shadow-cyan-200 hover:-translate-y-0.5 active:scale-95">
                    Start Scanning
                </Link>
            </div>
        );
    }

    const biomarkers = [
        { key: "tb", label: "T. Bilirubin", unit: "mg/dL" },
        { key: "db", label: "D. Bilirubin", unit: "mg/dL" },
        { key: "alkphos", label: "Alk. Phos", unit: "U/L" },
        { key: "sgpt", label: "SGPT (ALT)", unit: "U/L" },
        { key: "sgot", label: "SGOT (AST)", unit: "U/L" },
        { key: "tp", label: "T. Protein", unit: "g/dL" },
        { key: "alb", label: "Albumin", unit: "g/dL" },
        { key: "agRatio", label: "A/G Ratio", unit: "" },
    ];

    const getTrend = (key: string) => {
        if (!previousRecord) return "none";
        const current = (latestRecord as any)[key];
        const prev = (previousRecord as any)[key];
        if (current === null || prev === null) return "none";
        if (Number(current) > Number(prev)) return "up";
        if (Number(current) < Number(prev)) return "down";
        return "same";
    };

    const getDietSuggestions = () => {
        const suggestions: string[] = [];
        if (latestRecord.prediction === 0) {
            suggestions.push("Status looks stable. Maintain a high-fiber intake and stay active.");
        } else {
            suggestions.push("High biomarkers detected. Switch to a liver-detox diet rich in antioxidants.");
        }

        biomarkers.forEach(bio => {
            const trend = getTrend(bio.key);
            const currentVal = (latestRecord as any)[bio.key];
            if (trend === "up" && currentVal > 40) {
                if (["sgpt", "sgot", "alkphos"].includes(bio.key)) 
                    suggestions.push(`Rising ${bio.label}: Cut out processed fats and alcohol immediately.`);
                if (["tb", "db"].includes(bio.key))
                    suggestions.push(`High ${bio.label}: Increase water intake to 3L+ to help filtration.`);
            }
        });

        if (suggestions.length < 3) {
            suggestions.push("Focus on cruciferous vegetables like broccoli and cauliflower.");
            suggestions.push("Prioritize quality sleep to allow liver regeneration.");
        }

        return [...new Set(suggestions)].slice(0, 4);
    };

    return (
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl border border-white dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/40 dark:shadow-none space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                        <Activity size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] font-poppins">Diagnosis Trends</span>
                    </div>
                    <h2 className="text-3xl font-poppins font-black text-slate-900 dark:text-white">Health Comparison</h2>
                    <p className="text-slate-500 font-barlow text-sm font-medium">Tracking your vitals across {selectedType.toLowerCase()} analyses.</p>
                </div>

                <div className="flex bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl w-fit border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                    {["LIVER", "KIDNEY"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-6 py-2 rounded-xl text-[11px] font-black font-poppins tracking-wider transition-all duration-300 ${
                                selectedType === type
                                    ? "bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-md scale-105"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            }`}
                            disabled={type === "KIDNEY"}
                        >
                            {type} {type === "KIDNEY" && "⌛"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {biomarkers.map((bio) => {
                    const trend = getTrend(bio.key);
                    const currentVal = (latestRecord as any)[bio.key];
                    const prevVal = previousRecord ? (previousRecord as any)[bio.key] : null;

                    return (
                        <div key={bio.key} className="group relative bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-700/50 p-6 rounded-3xl hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-xl shadow-slate-100 dark:shadow-none">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 font-poppins uppercase tracking-widest leading-none">{bio.label}</span>
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                    trend === "up" ? "bg-orange-50 text-orange-500" : 
                                    trend === "down" ? "bg-emerald-50 text-emerald-500" : 
                                    "bg-slate-100 text-slate-400"
                                }`}>
                                    {trend === "up" && <MoveUpRight size={12} />}
                                    {trend === "down" && <MoveDownRight size={12} />}
                                    {trend === "same" && <Minus size={12} />}
                                    {trend === "none" && <Minus size={12} />}
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1.5 mb-1">
                                <span className="text-2xl font-poppins font-black text-slate-900 dark:text-white leading-none tracking-tight">{currentVal ?? "--"}</span>
                                <span className="text-xs font-bold text-slate-400 font-barlow italic">{bio.unit}</span>
                            </div>
                            {prevVal !== null && (
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-barlow">
                                    Last scan was <span className="text-slate-900 dark:text-slate-300">{prevVal}</span>
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="relative group bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/20 dark:to-transparent border border-emerald-500/20 dark:border-emerald-800/30 rounded-[2.5rem] p-8 overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Leaf size={120} className="text-emerald-600 rotate-12" />
                </div>
                
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                            <Leaf size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-poppins font-black text-emerald-900 dark:text-emerald-300">Natural Vitality Plan</h3>
                            <p className="text-xs font-bold text-emerald-700/60 dark:text-emerald-500/60 uppercase tracking-widest font-poppins">Personalized Diet Recommendations</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {getDietSuggestions().map((suggestion, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-white/50 dark:bg-slate-900/30 border border-emerald-100/50 dark:border-emerald-800/20 rounded-2xl backdrop-blur-sm transition-transform hover:scale-[1.02]">
                                <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-sm font-barlow font-bold text-emerald-800 dark:text-emerald-400 leading-relaxed">
                                    {suggestion}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-poppins border-t border-emerald-500/10 mt-4">
                        <p className="text-[10px] text-emerald-600 font-black italic max-w-[70%] text-center sm:text-left">
                            *This guidance is AI-generated based on biomarker fluctuations.
                        </p>
                        <Link href="/dashboard/diet-plan" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-200">
                            Download Full Plan
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
