export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import DietPlans from "@/components/features/dashboard/DietPlans";
import { FileText, Printer, ChevronRight } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const recentRecords = await prisma.record.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    return (
        <main className="w-full min-h-screen space-y-6 md:space-y-10 pb-32 antialiased px-3 md:px-6 lg:px-8 max-w-7xl mx-auto">
            <header className="flex items-center justify-between py-4 md:py-6 border-b border-gray-100 dark:border-white/5">
                <div className="space-y-0.5">
                    <h1 className="text-2xl md:text-4xl font-poppins font-black text-slate-900 dark:text-white tracking-tight">
                        Overview
                    </h1>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-poppins">Personal Health Summary</p>
                </div>
                
                <Link href="/dashboard/analyze" 
                    className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl md:rounded-2xl hover:shadow-xl transition-all active:scale-95 font-poppins text-[10px] md:text-xs uppercase tracking-widest">
                    <span>New Analysis</span>
                </Link>
            </header>

            <div className="space-y-10 md:space-y-16">
                {/* Recent Analysis: Grid/Cards on Mobile, List on Web */}
                <section>
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <div>
                            <h2 className="text-xl md:text-3xl font-poppins font-black text-slate-900 dark:text-white tracking-tight">Recent Analysis</h2>
                            <p className="text-slate-400 dark:text-slate-500 font-barlow text-[10px] md:text-sm mt-0.5">Latest biomarker trends and reports.</p>
                        </div>
                        <Link href="/dashboard/history" className="text-[10px] font-black uppercase tracking-widest text-cyan-600 hover:text-cyan-700 transition-colors">
                            View All →
                        </Link>
                    </div>

                    {recentRecords.length === 0 ? (
                        <div className="py-16 text-center bg-slate-50/50 dark:bg-slate-900/30 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/5">
                           <p className="font-poppins font-black text-slate-300 dark:text-slate-700 text-xs uppercase tracking-widest">No diagnostic history found</p>
                        </div>
                    ) : (
                        <>
                            {/* List View for Desktop (md+) */}
                            <div className="hidden md:block bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-50 dark:border-white/5">
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Report Type</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                            {recentRecords.map((record: any) => (
                                                <tr key={record.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-8 py-4 text-sm font-bold text-slate-600 dark:text-slate-400 font-barlow">
                                                        {new Date(record.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                                <FileText size={16} />
                                                            </div>
                                                            <span className="font-poppins font-bold text-slate-900 dark:text-white text-sm">{record.type} Report</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${record.prediction === 1 ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                            {record.prediction === 1 ? "Consult Doctor" : "Normal"}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-4 text-right transform group-hover:translate-x-1 transition-transform">
                                                        <Link href={`/dashboard/report/${record.id}`} 
                                                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-lg active:scale-95">
                                                            View Report
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Cards View for Mobile (sm-) - Smaller & Compact */}
                            <div className="grid grid-cols-1 gap-4 md:hidden">
                                {recentRecords.slice(0, 3).map((record: any) => (
                                    <Link href={`/dashboard/report/${record.id}`} key={record.id} className="block group p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl shadow-sm active:scale-[0.98] transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${record.prediction === 1 ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {record.prediction === 1 ? "Consult Doctor" : "Normal"}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase font-barlow">{new Date(record.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-poppins font-black text-slate-900 dark:text-white text-sm">{record.type} Report</h4>
                                                <p className="text-[8px] font-bold text-slate-400 font-barlow mt-0.5 uppercase tracking-tighter opacity-60">REF: {record.id.slice(0, 8)}</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                <DietPlans />
            </div>

            <footer className="pt-16 pb-10 text-center border-t border-gray-100 dark:border-white/5">
                <p className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em] font-poppins">
                    DiagHeal · Digital Diagnostic Companion
                </p>
            </footer>
        </main>
    );
}