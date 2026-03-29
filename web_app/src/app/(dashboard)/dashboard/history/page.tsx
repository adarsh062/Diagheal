"use client";

// Mock Data
const HISTORY_DATA = [
  { id: "RPT-2026-001", type: "Liver Scan Analysis", date: "Feb 10, 2026", doctor: "Dr. A. Sharma", status: "Action Needed" },
  { id: "RPT-2026-002", type: "Liver Scan Analysis", date: "Jan 15, 2026", doctor: "AI Diagnosis", status: "Normal" },
  { id: "RPT-2025-098", type: "Kidney Check (Legacy)", date: "Dec 22, 2025", doctor: "Dr. K. Patel", status: "Normal" },
  { id: "RPT-2025-045", type: "Full Body Checkup", date: "Nov 05, 2025", doctor: "Dr. S. Gupta", status: "Normal" },
];

export default function HistoryPage() {
  return (
    <main className="p-8">
      <header className="mb-8">
         <h1 className="text-3xl font-poppins font-semibold text-black mb-2">Medical History</h1>
         <p className="text-gray-600 font-barlow"> Archive of all your past analyses and reports.</p>
      </header>

      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-8 shadow-lg overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="text-sm text-gray-500 border-b border-gray-200">
                     <th className="pb-4 font-medium pl-4">Report Name</th>
                     <th className="pb-4 font-medium">Date</th>
                     <th className="pb-4 font-medium">Ref. Doctor</th>
                     <th className="pb-4 font-medium">Status</th>
                     <th className="pb-4 font-medium">Action</th>
                  </tr>
               </thead>
               <tbody className="font-barlow">
                  {HISTORY_DATA.map((item, i) => (
                     <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-white/50 transition">
                        <td className="py-4 pl-4 font-bold text-gray-800">{item.type}</td>
                        <td className="py-4 text-gray-600">{item.date}</td>
                        <td className="py-4 text-gray-600">{item.doctor}</td>
                        <td className="py-4">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                           }`}>
                              {item.status}
                           </span>
                        </td>
                        <td className="py-4">
                           <a href={`/dashboard/report/${item.id}`} className="text-cyan-600 font-bold text-sm hover:underline">View</a>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </main>
  );
}
