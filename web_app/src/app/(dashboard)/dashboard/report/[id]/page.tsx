export const dynamic = "force-dynamic";
import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function ReportDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const record = await prisma.record.findUnique({
    where: { id: params.id },
  });

  if (!record || record.userId !== session.user.id) {
    notFound();
  }

  const dateStr = new Date(record.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isAbnormal = record.prediction === 1;
  const statusLabel = isAbnormal ? "Consult Doctor" : "Healthy Level";
  const statusStyle = isAbnormal
    ? "bg-red-100 text-red-700 border-red-200"
    : "bg-green-100 text-green-700 border-green-200";

  // Mapping biomarkers to findings
  const findings = [
    { name: "Total Bilirubin (TB)", value: record.tb ? `${record.tb} mg/dL` : "N/A", range: "0.1–1.2 mg/dL", type: "TB" },
    { name: "Direct Bilirubin (DB)", value: record.db ? `${record.db} mg/dL` : "N/A", range: "0–0.3 mg/dL", type: "DB" },
    { name: "Alk. Phosphatase", value: record.alkphos ? `${record.alkphos} U/L` : "N/A", range: "44–147 U/L", type: "Alkphos" },
    { name: "SGPT (ALT)", value: record.sgpt ? `${record.sgpt} IU/L` : "N/A", range: "7–56 IU/L", type: "Sgpt" },
    { name: "SGOT (AST)", value: record.sgot ? `${record.sgot} IU/L` : "N/A", range: "5–40 IU/L", type: "Sgot" },
    { name: "Total Proteins", value: record.tp ? `${record.tp} g/dL` : "N/A", range: "6–8.3 g/dL", type: "TP" },
    { name: "Albumin", value: record.alb ? `${record.alb} g/dL` : "N/A", range: "3.5–5 g/dL", type: "ALB" },
    { name: "A/G Ratio", value: record.agRatio || "N/A", range: "1.1–2.5", type: "AG_Ratio" },
  ];

  // Helper to determine status for each biomarker
  const getBiomarkerStatus = (type: string, val: number | null) => {
    if (val === null) return "N/A";
    const ranges: Record<string, [number, number]> = {
      TB: [0.1, 1.2], DB: [0, 0.3], Alkphos: [44, 147], Sgpt: [7, 56], Sgot: [5, 40], TP: [6, 8.3], ALB: [3.5, 5], AG_Ratio: [1.1, 2.5]
    };
    const range = ranges[type];
    if (!range) return "Normal";
    if (val > range[1]) return "High";
    if (val < range[0]) return "Low";
    return "Normal";
  };

  const findingsWithStatus = findings.map(f => ({
      ...f,
      status: getBiomarkerStatus(f.type, (record as any)[f.type.toLowerCase()] || (record as any)[f.type] || null)
  }));

  const recommendations = (record.recommendations as string[]) || [
    "Maintain a healthy diet low in saturated fats.",
    "Stay hydrated and exercise regularly.",
    "Consult your healthcare provider for a detailed clinical correlation.",
    "Keep track of physical symptoms like fatigue or jaundice."
  ];

  const summary = record.summary || (isAbnormal 
    ? "Elevated liver markers detected by the ML model indicate a potential abnormality. Further clinical investigation is recommended."
    : "Your liver parameters are within stable ranges according to the current analysis and model prediction.");

  return (
    <main className="w-full">
      <header className="mb-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2 font-barlow">
            <Link href="/dashboard" className="hover:text-cyan-600 transition-colors">Dashboard</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
            <Link href="/dashboard/history" className="hover:text-cyan-600 transition-colors">History</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-gray-500">Report Details</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-poppins font-semibold text-black dark:text-white">Liver Analysis Result</h1>
          <p className="text-sm text-gray-500 font-barlow mt-0.5">Generated on {dateStr} · ID: {record.id}</p>
        </div>
        <div className="flex gap-2.5 flex-wrap no-print">
          <Link href="/dashboard/analyze/liver" 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm shadow-lg shadow-cyan-200/50 transition">
             New Analysis
          </Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Result Card */}
          <div className="bg-white/70 dark:bg-slate-900 border border-white/80 dark:border-slate-700 rounded-[2rem] p-8">
             <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-1 text-center sm:text-left">
                    <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold mb-3 border ${statusStyle}`}>
                        {statusLabel}
                    </span>
                    <h3 className="text-xl font-bold font-poppins mb-2">{isAbnormal ? "Medical Consultation Advised" : "Healthy Biomarker Profile"}</h3>
                    <p className="text-sm text-gray-500 font-barlow leading-relaxed">
                        {isAbnormal 
                          ? "Our analysis suggests that you should visit a healthcare professional for a detailed consultation regarding your liver markers."
                          : "Your biomarker levels are within the normal range. You do not need to consult a doctor at this time."
                        }
                    </p>
                </div>
             </div>
          </div>

          {/* Details Table */}
          <div className="bg-white/70 dark:bg-slate-900 border border-white/80 dark:border-slate-700 rounded-[2rem] p-8">
            <h3 className="text-lg font-bold font-poppins mb-6">Biomarker Details</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <th className="pb-4 font-semibold">Test Name</th>
                            <th className="pb-4 font-semibold">Result</th>
                            <th className="pb-4 font-semibold">Normal Range</th>
                            <th className="pb-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="font-barlow">
                        {findingsWithStatus.map((f, i) => (
                            <tr key={i} className="border-b border-gray-50 last:border-0">
                                <td className="py-4 font-semibold text-gray-800 dark:text-gray-200">{f.name}</td>
                                <td className="py-4 font-bold text-cyan-600">{f.value}</td>
                                <td className="py-4 text-xs text-gray-400">{f.range}</td>
                                <td className="py-4">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        f.status === 'High' ? 'bg-red-100 text-red-600' : 
                                        f.status === 'Low' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                        {f.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
           <div className="bg-cyan-600 text-white rounded-[2.5rem] p-7 shadow-xl shadow-cyan-100">
                <h3 className="text-lg font-bold font-poppins mb-4 flex items-center gap-2">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                   Next Steps
                </h3>
                <ul className="space-y-4">
                    {recommendations.map((rec, i) => (
                        <li key={i} className="flex gap-3 text-sm font-barlow leading-relaxed">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-300 shrink-0" />
                            {rec}
                        </li>
                    ))}
                </ul>
           </div>

           <div className="bg-white/70 dark:bg-slate-900 border border-white/80 dark:border-slate-700 rounded-[2.5rem] p-7">
                <h3 className="font-bold font-poppins text-gray-800 dark:text-white mb-4">Patient Info</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Age:</span>
                        <span className="font-bold">{record.age ? `${record.age} years` : "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Gender:</span>
                        <span className="font-bold">{record.gender || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Record Type:</span>
                        <span className="font-bold text-cyan-600">{record.type}</span>
                    </div>
                </div>
           </div>
        </div>
      </div>
    </main>
  );
}
