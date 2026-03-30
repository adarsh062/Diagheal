"use client";

import { useState } from "react";
import { deleteRecord } from "./actions";

interface RecordItem {
  id: string;
  prediction: number;
  confidence: number;
  userId: string;
  createdAt: Date;
}

export default function HistoryTable({ initialRecords }: { initialRecords: RecordItem[] }) {
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My DiagHeal Report",
          text: "Check out my AI-powered liver analysis report on DiagHeal.",
          url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers without Web Share API
      try {
        await navigator.clipboard.writeText(url);
        alert("Report link copied to clipboard!");
      } catch (err) {
        alert(`Copy this link to share: ${url}`);
      }
    }
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 font-barlow text-lg">No past reports found.</p>
        <p className="text-sm text-gray-400 mt-2">Any report you analyze will appear securely here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-sm text-gray-500 border-b border-gray-200">
            <th className="pb-4 font-medium pl-4">Report Details</th>
            <th className="pb-4 font-medium">Date</th>
            <th className="pb-4 font-medium">Confidence</th>
            <th className="pb-4 font-medium">Status</th>
            <th className="pb-4 font-medium text-right pr-4">Actions</th>
          </tr>
        </thead>
        <tbody className="font-barlow">
          {records.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-white/50 transition">
              <td className="py-4 pl-4">
                 <p className="font-bold text-gray-800">Liver Scan Analysis</p>
                 <p className="text-xs text-gray-400 font-mono mt-0.5 select-none">{item.id.slice(0, 12)}...</p>
              </td>
              <td className="py-4 text-gray-600 font-medium">
                 {new Date(item.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
              </td>
              <td className="py-4 text-gray-600 font-medium whitespace-nowrap">
                 {(item.confidence * 100).toFixed(1)}% <span className="text-gray-400 text-xs font-normal">Accurate</span>
              </td>
              <td className="py-4">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                  item.prediction === 0 ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${item.prediction === 0 ? "bg-green-500" : "bg-red-500 animate-pulse"}`}></span>
                  {item.prediction === 0 ? "Normal Level" : "Anomaly Detected"}
                </span>
              </td>
              <td className="py-4 pr-4">
                 <div className="flex items-center justify-end gap-3 sm:gap-4">
                    <a 
                      href={`/dashboard/report/${item.id}`} 
                      className="text-cyan-600 font-bold text-sm tracking-wide hover:underline inline-flex items-center gap-1"
                    >
                      View
                    </a>
                    <button 
                      onClick={() => handleShare(item.id)} 
                      className="text-blue-600 font-bold text-sm tracking-wide hover:underline inline-flex items-center gap-1"
                      title="Share report link"
                    >
                      Share
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      disabled={isDeleting === item.id}
                      className="text-red-500 hover:text-red-600 font-bold text-sm tracking-wide hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                    >
                      {isDeleting === item.id ? "Deleting..." : "Clear"}
                    </button>
                 </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
