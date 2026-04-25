"use client";
export const dynamic = "force-dynamic";
import { useState, useRef } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

// ─── Types ────────────────────────────────────────────────────────────────────
type Doctor = {
    id: number;
    name: string;
    specialty: string;
    experience: number;
    rating: number;
    distance: string;
    nextAvailable: string;
    hospital: string;
    avatar: string;
};

type BookingStatus = "idle" | "loading" | "success";

// ─── Mock Doctors ─────────────────────────────────────────────────────────────
const MOCK_DOCTORS: Doctor[] = [
    {
        id: 1,
        name: "Dr. Arjun Sharma",
        specialty: "Gastroenterologist & Hepatologist",
        experience: 14,
        rating: 4.9,
        distance: "1.2 km",
        nextAvailable: "Tomorrow, 10:00 AM",
        hospital: "Apollo Hospitals, Bhopal",
        avatar: "AS",
    },
    {
        id: 2,
        name: "Dr. Priya Mehta",
        specialty: "Hepatologist",
        experience: 9,
        rating: 4.7,
        distance: "2.8 km",
        nextAvailable: "Today, 5:30 PM",
        hospital: "AIIMS Bhopal",
        avatar: "PM",
    },
    {
        id: 3,
        name: "Dr. Ravi Nair",
        specialty: "Gastroenterology Specialist",
        experience: 18,
        rating: 4.8,
        distance: "4.1 km",
        nextAvailable: "Feb 25, 9:00 AM",
        hospital: "Hamidia Hospital, Bhopal",
        avatar: "RN",
    },
];

// ─── Biomarker config with normal ranges ──────────────────────────────────────
const BIOMARKER_CONFIG = [
    { label: "Total Bilirubin", key: "TB",       unit: "mg/dL",  normal: [0.1, 1.2],  abbr: "TB"  },
    { label: "Direct Bilirubin", key: "DB",      unit: "mg/dL",  normal: [0, 0.3],    abbr: "DB"  },
    { label: "Alk. Phosphatase", key: "Alkphos", unit: "U/L",    normal: [44, 147],   abbr: "ALP" },
    { label: "SGPT (ALT)",       key: "Sgpt",    unit: "IU/L",   normal: [7, 56],     abbr: "ALT" },
    { label: "SGOT (AST)",       key: "Sgot",    unit: "IU/L",   normal: [5, 40],     abbr: "AST" },
    { label: "Total Proteins",   key: "TP",      unit: "g/dL",   normal: [6, 8.3],    abbr: "TP"  },
    { label: "Albumin",          key: "ALB",     unit: "g/dL",   normal: [3.5, 5],    abbr: "ALB" },
    { label: "A/G Ratio",        key: "AG_Ratio",unit: "",        normal: [1.1, 2.5],  abbr: "A/G" },
];

// ─── Star Rating ──────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-300 dark:text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 ml-1">{rating}</span>
        </div>
    );
}

// ─── Booking Modal ────────────────────────────────────────────────────────────
function BookingModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
    const [bookingStatus, setBookingStatus] = useState<BookingStatus>("idle");
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("morning");
    const today = new Date().toISOString().split("T")[0];
    const handleConfirm = async () => {
        if (!date) return;
        setBookingStatus("loading");
        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    doctorName: doctor.name,
                    specialty: doctor.specialty,
                    hospital: doctor.hospital,
                    date: date,
                    timeSlot: timeSlot
                })
            });
            if (!res.ok) throw new Error("Failed to book");
            setBookingStatus("success");
        } catch (error) {
            console.error(error);
            setBookingStatus("idle");
            alert("Failed to book appointment. Please try again.");
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {bookingStatus === "success" ? (
                    <div className="p-10 text-center">
                        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
                            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-2xl font-poppins font-bold text-gray-900 dark:text-white mb-2">Confirmed!</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 font-barlow text-sm">
                            Booked with <span className="font-bold text-cyan-600 dark:text-cyan-400">{doctor.name}</span> on{" "}
                            {new Date(date).toLocaleDateString("en-IN", { weekday: "short", month: "long", day: "numeric" })}
                        </p>
                        <Button onClick={onClose} variant="primary" className="w-full">Done</Button>
                    </div>
                ) : (
                    <>
                        <div className="bg-gradient-to-br from-cyan-600 to-teal-600 p-6 text-white">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-lg font-poppins shrink-0">{doctor.avatar}</div>
                                <div>
                                    <h3 className="text-lg font-poppins font-bold">{doctor.name}</h3>
                                    <p className="text-cyan-100 text-sm">{doctor.specialty}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Select Date</label>
                                <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Preferred Time</label>
                                <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition">
                                    <option value="morning">🌅 Morning (9 AM – 12 PM)</option>
                                    <option value="evening">🌆 Evening (4 PM – 7 PM)</option>
                                </select>
                            </div>
                            <button onClick={handleConfirm} disabled={!date || bookingStatus === "loading"}
                                className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white font-bold transition-all flex items-center justify-center gap-2">
                                {bookingStatus === "loading" ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Confirming...</>) : "Confirm Appointment"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── BiomarkerBar Component ───────────────────────────────────────────────────
function BiomarkerBar({ label, value, unit, normal, abbr }: {
    label: string; value: string; unit: string; normal: number[]; abbr: string;
}) {
    const val = parseFloat(value);
    const isValid = !isNaN(val);
    const high = isValid && val > normal[1];
    const low = isValid && val < normal[0];
    const flagged = high || low;

    // Calculate percentage position on scale for the bar
    // Scale: 0 → normal[0]*0.5, normal[0] → 33%, normal[1] → 66%, normal[1]*1.5 → 100%
    const scaleMax = normal[1] * 1.8;
    const scaleMin = 0;
    const pct = isValid ? Math.min(100, Math.max(0, ((val - scaleMin) / (scaleMax - scaleMin)) * 100)) : 0;
    const normalStartPct = (normal[0] / scaleMax) * 100;
    const normalEndPct = (normal[1] / scaleMax) * 100;

    return (
        <div className={`rounded-2xl p-4 border transition-all ${flagged
            ? "bg-orange-50/80 dark:bg-red-950/30 border-orange-200 dark:border-red-900/40"
            : "bg-white/70 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700"}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-poppins text-gray-500 dark:text-gray-400">{abbr}</span>
                    {flagged && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${high ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400" : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"}`}>
                            {high ? "HIGH" : "LOW"}
                        </span>
                    )}
                </div>
                <span className={`text-base font-bold font-poppins ${flagged ? "text-orange-600 dark:text-orange-400" : "text-gray-800 dark:text-white"}`}>
                    {value || "—"} <span className="text-[10px] font-normal text-gray-400">{unit}</span>
                </span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2 font-barlow">{label}</p>

            {/* Range bar */}
            {isValid && (
                <div className="relative h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    {/* Normal range highlight */}
                    <div
                        className="absolute top-0 h-full bg-green-200 dark:bg-green-900/50 rounded-full"
                        style={{ left: `${normalStartPct}%`, width: `${normalEndPct - normalStartPct}%` }}
                    />
                    {/* Value indicator */}
                    <div
                        className={`absolute top-0 h-full w-1.5 rounded-full -translate-x-1/2 transition-all duration-1000 ${flagged ? "bg-orange-500" : "bg-cyan-500"}`}
                        style={{ left: `${pct}%` }}
                    />
                </div>
            )}
            <div className="flex justify-between mt-1">
                <span className="text-[9px] text-gray-400">Normal: {normal[0]}</span>
                <span className="text-[9px] text-gray-400">{normal[1]}</span>
            </div>
        </div>
    );
}

// ─── Confidence Gauge ─────────────────────────────────────────────────────────
function ConfidenceGauge({ confidence, isAbnormal }: { confidence: number; isAbnormal: boolean }) {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (confidence / 100) * circumference * 0.75; // 270deg arc
    const color = isAbnormal ? "#f97316" : "#10b981";

    return (
        <div className="relative flex items-center justify-center w-36 h-36">
            <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 120 120">
                {/* Track */}
                <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="10"
                    strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                    strokeLinecap="round"
                    className="text-gray-200 dark:text-slate-700" />
                {/* Progress */}
                <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10"
                    strokeDasharray={`${(confidence / 100) * circumference * 0.75} ${circumference}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold font-poppins ${isAbnormal ? "text-orange-500" : "text-emerald-500"}`}>
                    {confidence.toFixed(0)}%
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-barlow">Confidence</span>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LiverAnalyzePage() {
    const [activeTab, setActiveTab] = useState<"new" | "compare">("new");
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [step, setStep] = useState<"upload" | "ready" | "extracting" | "form" | "analyzing" | "result">("upload");
    const [extractError, setExtractError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        Age: "", Gender: "", TB: "", DB: "", Alkphos: "", Sgpt: "", Sgot: "", TP: "", ALB: "", AG_Ratio: "",
    });
    const [result, setResult] = useState<any>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    // ── Drag handlers ──
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) { setFileName(file.name); setUploadedFile(file); setStep("ready"); }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setFileName(file.name); setUploadedFile(file); setStep("ready"); }
    };

    const startExtraction = async () => {
        if (!uploadedFile) return;
        setStep("extracting");
        setExtractError(null);
        try {
            const fd = new FormData();
            fd.append("file", uploadedFile);
            const res = await fetch("/api/extract-report", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Extraction failed");
            setFormData({
                Age:      data.Age      != null ? String(data.Age)      : "",
                Gender:   data.Gender   != null ? String(data.Gender)   : "",
                TB:       data.TB       != null ? String(data.TB)       : "",
                DB:       data.DB       != null ? String(data.DB)       : "",
                Alkphos:  data.Alkphos  != null ? String(data.Alkphos)  : "",
                Sgpt:     data.Sgpt     != null ? String(data.Sgpt)     : "",
                Sgot:     data.Sgot     != null ? String(data.Sgot)     : "",
                TP:       data.TP       != null ? String(data.TP)       : "",
                ALB:      data.ALB      != null ? String(data.ALB)      : "",
                AG_Ratio: data.AG_Ratio != null ? String(data.AG_Ratio) : "",
            });
            setStep("form");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Could not read report values. Please ensure the image is clear.";
            setExtractError(msg);
            setStep("ready");
        }
    };

    const [recordsHistory, setRecordsHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const res = await fetch("/api/records");
            if (res.ok) {
                const data = await res.json();
                setRecordsHistory(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleDeleteRecord = async (id: string) => {
        try {
            const res = await fetch(`/api/records/${id}`, { method: "DELETE" });
            if (res.ok) {
                setRecordsHistory((prev) => prev.filter((r) => r.id !== id));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep("analyzing");
        const payload = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => {
                if (value === "") return [key, null];
                if (key === "Gender") return [key, value];
                if (key === "Age") return [key, Math.max(1, Math.round(Number(value)))];
                return [key, Number(value)];
            })
        );
        try {
          // fetch from ai engine
            // To replace it later for production, change the URL back to: "https://diagheal.onrender.com/analyze-report"
            const response = await fetch("http://127.0.0.1:8000/analyze-report", {
                method: "POST",
                headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
                body: JSON.stringify(payload),
            });
            if (!response.ok) { 
                const errText = await response.text();
                throw new Error(`Server error ${response.status}: ${errText.slice(0, 200)}`);
            }
            const data = await response.json();
            setResult({
                status: data.status ?? "success",
                prediction: data.prediction,
                confidence_score: data.confidence_score,
                message: data.message ?? "",
            });
            
            // Save to DB
            if (data.prediction !== null && data.prediction !== undefined) {
                try {
                    await fetch('/api/records', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            prediction: data.prediction, 
                            confidence: data.confidence_score,
                            age: formData.Age,
                            gender: formData.Gender,
                            tb: formData.TB,
                            db: formData.DB,
                            alkphos: formData.Alkphos,
                            sgpt: formData.Sgpt,
                            sgot: formData.Sgot,
                            tp: formData.TP,
                            alb: formData.ALB,
                            agRatio: formData.AG_Ratio,
                            type: "LIVER"
                        })
                    });
                } catch (e) {
                    console.error("Failed to save record", e);
                }
            }

            setStep("result");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Network error — could not reach the analysis server.";
            setResult({ status: "error", prediction: null, confidence_score: null, message: `Analysis failed: ${msg}` });
            setStep("result");
        }
    };

    const resetFlow = () => { setFileName(null); setUploadedFile(null); setResult(null); setExtractError(null); setStep("upload"); };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const isAbnormal = result?.prediction === 1;
    const isError = result?.status === "error" || result?.prediction === null;

    return (
        <main className="w-full">
            {selectedDoctor && <BookingModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />}

            {/* Header */}
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-poppins font-semibold text-black dark:text-white mb-1.5">Liver Analysis</h1>
                <p className="text-gray-500 dark:text-gray-400 font-barlow tracking-wide text-sm">Upload your report and let AI extract and analyze your biomarkers.</p>
            </header>

            {/* Toggle Tabs */}
            <div className="flex justify-center md:justify-start mb-7">
                <div className="flex gap-1 bg-gray-100 dark:bg-slate-800/60 p-1 rounded-full w-fit">
                    {(["new", "compare"] as const).map((tab) => (
                        <button key={tab} onClick={() => { setActiveTab(tab); if (tab === "compare") fetchHistory(); }}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 capitalize ${activeTab === tab
                                ? "bg-white dark:bg-cyan-600 text-cyan-700 dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                            {tab === "new" ? "New Diagnosis" : "Track History"}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === "new" ? (
                <div className="space-y-6">

                    {/* ── Steps 1–4 enclosed card ── */}
                    {step !== "result" && (
                        <div className={`relative bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-7 md:p-10 border-2 transition-all duration-300 ${dragActive ? "border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20" : "border-gray-200 dark:border-slate-700"}`}>

                            {/* STEP 1: UPLOAD */}
                            {step === "upload" && (
                                <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl"
                                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                                    <input ref={inputRef} type="file" className="hidden" onChange={handleChange} accept="image/*,application/pdf" />
                                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                        <svg className="w-10 h-10 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-poppins font-bold text-gray-900 dark:text-white mb-2">Drop your Report here</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-barlow mb-7 max-w-sm mx-auto">
                                        Supported: PDF, JPG, PNG. Ensure the text is clearly visible.
                                    </p>
                                    <button onClick={() => inputRef.current?.click()}
                                        className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-cyan-200/50 dark:shadow-none font-poppins text-sm">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        Browse Files
                                    </button>
                                </div>
                            )}

                            {/* STEP 2: READY */}
                            {step === "ready" && (
                                <div className="py-10 text-center">
                                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1 font-poppins truncate max-w-xs mx-auto">{fileName}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-barlow">File ready — click Analyze to begin AI extraction</p>
                                    {extractError && (
                                        <div className="mb-6 mx-auto max-w-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-2xl px-5 py-4 flex items-start gap-3 text-left">
                                            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                                            <div>
                                                <p className="text-sm font-bold text-red-700 dark:text-red-400">Extraction Failed</p>
                                                <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">{extractError}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex gap-3 justify-center flex-wrap">
                                        <button onClick={resetFlow} className="px-6 py-2.5 rounded-full border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-all font-poppins">
                                            Remove
                                        </button>
                                        <button onClick={startExtraction} className="px-8 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm transition-all hover:-translate-y-0.5 font-poppins shadow-lg shadow-cyan-200/50 dark:shadow-none">
                                            {extractError ? "Retry Extraction" : "Analyze Now"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: EXTRACTING */}
                            {step === "extracting" && (
                                <div className="text-center py-20">
                                    <div className="relative w-16 h-16 mx-auto mb-5">
                                        <div className="absolute inset-0 border-4 border-cyan-100 dark:border-cyan-900/50 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-transparent border-t-cyan-600 rounded-full animate-spin" />
                                        <div className="absolute inset-2 border-3 border-transparent border-t-teal-400 rounded-full animate-spin" style={{ animationDuration: "0.6s", animationDirection: "reverse" }} />
                                    </div>
                                    <h3 className="text-lg font-bold dark:text-white font-poppins mb-2">Reading Your Report...</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-barlow">Our AI is extracting biomarker values</p>
                                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 font-barlow">This may take a few moments</p>
                                </div>
                            )}

                            {/* STEP 4: FORM */}
                            {(step === "form" || step === "analyzing") && (
                                <div className="max-w-2xl mx-auto">
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                                        <div>
                                            <h3 className="text-xl font-bold dark:text-white font-poppins">Verify Extracted Data</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-barlow mt-0.5">Review and correct values if needed</p>
                                        </div>
                                        <button onClick={resetFlow} className="text-sm text-red-500 hover:text-red-600 font-semibold hover:underline transition">Cancel</button>
                                    </div>
                                    <form onSubmit={handleAnalyze} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[
                                                { label: "Age (years)", name: "Age", val: formData.Age, type: "number" },
                                                { label: "Gender", name: "Gender", val: formData.Gender, type: "select" },
                                                { label: "Total Bilirubin (TB)", name: "TB", val: formData.TB, type: "number" },
                                                { label: "Direct Bilirubin (DB)", name: "DB", val: formData.DB, type: "number" },
                                                { label: "Alkaline Phosphatase (Alkphos)", name: "Alkphos", val: formData.Alkphos, type: "number" },
                                                { label: "SGPT / ALT", name: "Sgpt", val: formData.Sgpt, type: "number" },
                                                { label: "SGOT / AST", name: "Sgot", val: formData.Sgot, type: "number" },
                                                { label: "Total Proteins (TP)", name: "TP", val: formData.TP, type: "number" },
                                                { label: "Albumin (ALB)", name: "ALB", val: formData.ALB, type: "number" },
                                                { label: "A/G Ratio", name: "AG_Ratio", val: formData.AG_Ratio, type: "number" },
                                            ].map((f) => (
                                                <div key={f.name}>
                                                    <label className="block text-xs font-bold mb-1.5 text-gray-600 dark:text-gray-400 uppercase tracking-wide">{f.label}</label>
                                                    {f.type === "select" ? (
                                                        <select name={f.name} value={f.val} onChange={handleInputChange} disabled={step === "analyzing"}
                                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-sm">
                                                            <option value="">Select Gender</option>
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                        </select>
                                                    ) : (
                                                        <input type="number" step="any" name={f.name} value={f.val} onChange={handleInputChange} disabled={step === "analyzing"}
                                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-sm" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button type="submit" disabled={step === "analyzing"}
                                            className="w-full py-4 text-base font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl hover:from-cyan-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-200/40 dark:shadow-none font-poppins">
                                            {step === "analyzing" ? (
                                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing with ML Model...</>
                                            ) : (
                                                <>Confirm & Analyze Data <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── STEP 5: RESULT DASHBOARD ── */}
                    {step === "result" && result && (
                        <div className="space-y-5">

                            {/* ── Result Hero ── */}
                            <div className={`relative rounded-[2.5rem] overflow-hidden border-2 ${isError
                                ? "bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900/40"
                                : isAbnormal
                                    ? "bg-gradient-to-br from-orange-50/90 to-red-50/80 dark:from-red-950/30 dark:to-orange-950/20 border-orange-200 dark:border-red-900/40"
                                    : "bg-gradient-to-br from-emerald-50/90 to-cyan-50/80 dark:from-green-950/30 dark:to-cyan-950/20 border-emerald-200 dark:border-green-900/40"}`}>
                                {/* Decorative blob */}
                                <div className={`absolute -top-10 -right-10 w-52 h-52 rounded-full blur-3xl opacity-20 ${isError ? "bg-red-400" : isAbnormal ? "bg-orange-400" : "bg-emerald-400"}`} />

                                <div className="relative z-10 p-7 md:p-10">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                                        {/* Status Icon */}
                                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 mx-auto sm:mx-0 ${isError ? "bg-red-100 dark:bg-red-900/40" : isAbnormal ? "bg-orange-100 dark:bg-red-900/40" : "bg-emerald-100 dark:bg-green-900/40"}`}>
                                            {isError ? (
                                                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            ) : isAbnormal ? (
                                                <svg className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Text + Gauge Row */}
                                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                            <div className="flex-1 text-center sm:text-left">
                                                <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap mb-3">
                                                    <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full ${isError
                                                        ? "bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                                                        : isAbnormal
                                                            ? "bg-orange-200 dark:bg-red-900/50 text-orange-800 dark:text-orange-300"
                                                            : "bg-emerald-200 dark:bg-green-900/50 text-emerald-800 dark:text-emerald-300"}`}>
                                                        {isError ? "Analysis Error" : isAbnormal ? "Please Consult a Doctor" : "Consultation Not Required"}
                                                    </span>
                                                </div>
                                                <p className={`text-base font-barlow leading-relaxed ${isError ? "text-red-700 dark:text-red-300" : isAbnormal ? "text-orange-900 dark:text-orange-200" : "text-emerald-900 dark:text-emerald-200"}`}>
                                                    {isError ? "Our analysis system encountered an error. Please contact support or try again later." : isAbnormal
                                                        ? "Our analysis suggests that you should visit a healthcare professional for a detailed consultation regarding your liver markers."
                                                        : "Your biomarker levels are within the normal range. You do not need to consult a doctor at this time."
                                                    }
                                                </p>
                                                <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
                                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-barlow">
                                                        {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                                                    </p>
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/5 flex flex-wrap gap-3 justify-end">
                                        {!isError && (
                                            <button onClick={() => window.print()}
                                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 transition font-poppins">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                Download PDF
                                            </button>
                                        )}
                                        <button onClick={resetFlow}
                                            className="flex items-center gap-2 px-5 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 transition font-poppins">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                            New Analysis
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ── Biomarker Breakdown ── */}
                            <div className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border border-white/80 dark:border-slate-700 rounded-[2rem] p-6 md:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-white font-poppins text-lg">Biomarker Analysis</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-barlow">Green zone = normal range · Orange = outside range</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-barlow text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"/> Normal</span>
                                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block"/> Out of Range</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {BIOMARKER_CONFIG.map((b) => (
                                        <BiomarkerBar
                                            key={b.key}
                                            label={b.label}
                                            value={(formData as any)[b.key]}
                                            unit={b.unit}
                                            normal={b.normal}
                                            abbr={b.abbr}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* ── Patient Info Summary ── */}
                            <div className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border border-white/80 dark:border-slate-700 rounded-[2rem] p-6">
                                <h3 className="font-bold text-gray-800 dark:text-white font-poppins text-base mb-4">Patient Info</h3>
                                <div className="flex flex-wrap gap-4">
                                    {formData.Age && (
                                        <div className="bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formData.Age} yrs</span>
                                        </div>
                                    )}
                                    {formData.Gender && (
                                        <div className="bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-2">
                                            <span className="text-sm">{formData.Gender === "Male" ? "♂" : "♀"}</span>
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formData.Gender}</span>
                                        </div>
                                    )}
                                    <div className="bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">LFT Report</span>
                                    </div>
                                    <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800/40 rounded-xl px-4 py-2.5 flex items-center gap-2">
                                        <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400">ML Model Analyzed</span>
                                    </div>
                                </div>
                            </div>

                            {/* ── Recommended Specialists Integration ── */}
                            {isAbnormal && (
                                <div className="animate-in slide-in-from-bottom-5 duration-1000">
                                    <div className="bg-gradient-to-br from-orange-500/10 to-transparent p-10 rounded-[3.5rem] border border-orange-500/20 backdrop-blur-xl">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                                            <div className="space-y-4 text-center md:text-left">
                                                <div className="flex items-center justify-center md:justify-start gap-3">
                                                    <span className="px-4 py-1.5 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20">Critical Alert</span>
                                                    <span className="text-orange-600 dark:text-orange-400 font-bold text-sm font-poppins">Action Advised</span>
                                                </div>
                                                <h3 className="text-4xl font-poppins font-black text-slate-900 dark:text-white leading-tight tracking-tighter">Consult a Liver Specialist</h3>
                                                <p className="text-slate-500 dark:text-slate-400 font-barlow text-lg max-w-xl leading-relaxed italic">
                                                    Your biomarker profile indicates substantial irregularities. We have identified verified <b>Hepatologists</b> and <b>Gastroenterologists</b> in the Bhopal region ready for consultation.
                                                </p>
                                            </div>
                                            <Link 
                                                href="/dashboard/doctors?specialty=Hepatologist"
                                                className="group relative px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                                Identify Specialists <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
                                            </Link> 
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                /* ── Track History Tab ── */
                <div className="space-y-4">
                    <h3 className="text-lg font-bold font-poppins text-gray-800 dark:text-gray-200 mb-5 px-1">Previous Reports</h3>

                    {loadingHistory ? (
                        <div className="text-center py-10">
                            <div className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto"></div>
                            <p className="mt-3 text-sm text-gray-500">Loading your history...</p>
                        </div>
                    ) : recordsHistory.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                            <p>No past reports found.</p>
                        </div>
                    ) : (
                        recordsHistory.map((r) => {
                            const isAbnormal = r.prediction === 1;
                            const statusLabel = isAbnormal ? "Action Needed" : "Normal";
                            const statusColor = isAbnormal ? "yellow" : "green";
                            const dateStr = new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
                            const handleViewHistory = () => {
                                setFormData({
                                    Age: r.age?.toString() || "",
                                    Gender: r.gender || "",
                                    TB: r.tb?.toString() || "",
                                    DB: r.db?.toString() || "",
                                    Alkphos: r.alkphos?.toString() || "",
                                    Sgpt: r.sgpt?.toString() || "",
                                    Sgot: r.sgot?.toString() || "",
                                    TP: r.tp?.toString() || "",
                                    ALB: r.alb?.toString() || "",
                                    AG_Ratio: r.agRatio?.toString() || "",
                                });
                                setResult({
                                    prediction: r.prediction,
                                    confidence_score: r.confidence,
                                    status: "success",
                                    message: r.prediction === 1 ? "The analysis indicates abnormalities suggesting liver disease." : "Your biomarker levels appear within normal range."
                                });
                                setStep("result");
                                setActiveTab("new");
                            };

                            return (
                            <div key={r.id} className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border border-white/80 dark:border-slate-700 rounded-[2rem] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-50 dark:hover:shadow-none transition-all duration-200">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${statusColor === "yellow" ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className="font-bold text-gray-900 dark:text-white font-poppins">Liver Scan Analysis</h4>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColor === "yellow"
                                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                                            : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"}`}>
                                            {statusLabel}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-barlow">{dateStr} · AI Diagnosis ({r.confidence?.toFixed(0) || 0}%)</p>
                                </div>
                                <div className="flex gap-2.5 flex-wrap">
                                    <button onClick={handleViewHistory} className="px-4 py-2 rounded-full bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-700 transition font-poppins">View Details</button>
                                    <button onClick={() => handleDeleteRecord(r.id)} className="px-4 py-2 rounded-full border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-900/20 transition font-poppins">Delete</button>
                                </div>
                            </div>
                        )})

                    )}
                </div>
            )}
        </main>
    );
}

