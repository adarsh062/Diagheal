"use client";

import { useState } from "react";
import { deleteRecord } from "./actions";
import { 
  Trash2, 
  Share2, 
  Eye, 
  Calendar, 
  Activity, 
  ChevronRight, 
  Hash, 
  ShieldCheck, 
  ShieldAlert,
  ClipboardList,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryRecord {
  id: string;
  type: string;
  prediction: number;
  confidence: number;
  createdAt: Date | string;
}

export default function HistoryTable({ initialRecords }: { initialRecords: HistoryRecord[] }) {
  const [records, setRecords] = useState(initialRecords);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      setIsDeleting(id);
      try {
        await deleteRecord(id);
        setRecords(records.filter((r) => r.id !== id));
      } catch (error) {
        alert("Failed to delete the report.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleShare = async (id: string) => {
    const url = `${window.location.origin}/dashboard/report/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Health Report - DiagHeal",
          text: "Check out my medical analysis report on DiagHeal.",
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Report link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (!records || records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 bg-white/50 border border-slate-200 rounded-3xl backdrop-blur-sm shadow-sm text-center">
        <div className="w-20 h-20 bg-indigo-50 flex items-center justify-center rounded-full mb-6">
          <ClipboardList className="w-10 h-10 text-indigo-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900">No reports found</h3>
        <p className="text-slate-500 mt-2 max-w-sm">
          You haven't performed any health analysis yet. Start your first analysis to see it here.
        </p>
        <Link 
          href="/dashboard/analyze" 
          className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          Start New Analysis
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table - Hidden on Mobile */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Diagnosis Detail</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Date & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {records.map((item, index) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${item.prediction === 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{item.type} ANALYSIS</span>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">#{item.id.slice(-6).toUpperCase()}</span>
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1 font-medium italic">
                              Professional Analysis Completed
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {item.prediction === 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold ring-4 ring-emerald-50">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          NORMAL
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold ring-4 ring-rose-50">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          CONSULT DOCTOR
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-3">
                        <div className="text-right mr-4">
                          <div className="text-sm font-medium text-slate-900">{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          <div className="text-[11px] text-slate-400 font-mono tracking-wider">REF: {item.id.slice(0, 8)}</div>
                        </div>
                        
                        <Link 
                          href={`/dashboard/report/${item.id}`}
                          className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          title="View Report"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </Link>
                        
                        <button 
                          onClick={() => handleShare(item.id)}
                          className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          title="Share Link"
                        >
                          <Share2 className="w-4.5 h-4.5" />
                        </button>

                        <button 
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeleting === item.id}
                          className={`p-2.5 rounded-xl transition-all shadow-sm ${isDeleting === item.id ? "bg-slate-50 text-slate-300" : "bg-slate-100 text-rose-500 hover:bg-rose-500 hover:text-white"}`}
                          title="Delete Permanently"
                        >
                          <Trash2 className={`w-4.5 h-4.5 ${isDeleting === item.id ? "animate-pulse" : ""}`} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List - Visible only on small screens */}
      <div className="md:hidden space-y-4">
        <AnimatePresence>
          {records.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${item.prediction === 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-none">{item.type} Analysis</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-widest">#{item.id.slice(-6)}</p>
                  </div>
                </div>
                {item.prediction === 0 ? (
                  <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-widest uppercase">Normal</span>
                ) : (
                  <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-black tracking-widest uppercase">Consult</span>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="text-[11px] font-bold text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/dashboard/report/${item.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    View Result
                  </Link>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-rose-50 text-rose-500 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}