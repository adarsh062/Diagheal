import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import HealthTrends from "@/components/features/dashboard/HealthTrends";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const [totalReports, actionNeeded, normalResults, appointments, historyRecords] = await Promise.all([
        prisma.record.count({ where: { userId: session.user.id } }),
        prisma.record.count({ where: { userId: session.user.id, prediction: 1 } }),
        prisma.record.count({ where: { userId: session.user.id, prediction: 0 } }),
        prisma.appointment.count({ where: { userId: session.user.id } }),
        prisma.record.findMany({
            where: { userId: session.user.id, type: "LIVER" },
            orderBy: { createdAt: "desc" },
            take: 2,
        }),
    ]);

    const latestRecord = historyRecords[0] || null;
    const previousRecord = historyRecords[1] || null;

    const recentRecords = await prisma.record.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
    });

    const nextAppointment = await prisma.appointment.findFirst({
        where: { userId: session.user.id, date: { gte: new Date() } },
        orderBy: { date: "asc" },
    });

    return (
        <main className="w-full min-h-screen space-y-8 pb-20 antialiased px-2 md:px-0">
            {/* Elegant Header with Stats Row */}
            <header className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-poppins">Personal Health Hub</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-poppins font-black text-slate-900 dark:text-white tracking-tight">
                            Dashboard
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/analyze" 
                            className="group flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-[1.5rem] hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-none transition-all active:scale-95 font-poppins text-xs uppercase tracking-widest">
                            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Scan New Report
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Analyses", value: totalReports.toString(), icon: "📊" },
                        { label: "Action Reqd", value: actionNeeded.toString(), icon: "🚨" },
                        { label: "Normal", value: normalResults.toString(), icon: "🌱" },
                        { label: "Consults", value: appointments.toString(), icon: "🤝" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white/80 dark:bg-slate-900/40 border border-white dark:border-slate-800 p-6 rounded-[2rem] shadow-sm flex items-center justify-between group hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                            <div>
                                <p className="text-3xl font-poppins font-black text-slate-900 dark:text-white leading-none">{stat.value}</p>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">{stat.label}</p>
                            </div>
                            <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0">{stat.icon}</span>
                        </div>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Comparison Feed */}
                <section className="lg:col-span-8 space-y-8">
                    <HealthTrends 
                        latestRecord={latestRecord as any} 
                        previousRecord={previousRecord as any} 
                    />
                </section>

                {/* Side Information Panels */}
                <aside className="lg:col-span-4 space-y-8">
                    {/* Integrated Appointment Card */}
                    <div className="relative group bg-slate-900 dark:bg-white rounded-[2.5rem] p-8 text-white dark:text-slate-900 shadow-2xl overflow-hidden min-h-[320px] flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-700" />
                        
                        <div className="relative z-10 flex flex-col h-full flex-grow">
                            <div className="flex items-center justify-between mb-10">
                                <span className="px-4 py-1.5 bg-white/10 dark:bg-slate-100/50 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest">Next Booking</span>
                                <div className="w-10 h-10 bg-white/10 dark:bg-slate-100 rounded-2xl flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                            </div>

                            {nextAppointment ? (
                                <div className="space-y-6 flex-grow">
                                    <div>
                                        <h3 className="text-3xl font-poppins font-black leading-tight">{nextAppointment.doctorName}</h3>
                                        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold font-poppins uppercase tracking-wider mt-1">{nextAppointment.specialty}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/5 dark:bg-slate-50 px-4 py-3 rounded-2xl border border-white/10 dark:border-slate-100">
                                            <p className="text-[9px] font-black uppercase text-slate-500 opacity-60">Date</p>
                                            <p className="text-sm font-black">{new Date(nextAppointment.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}</p>
                                        </div>
                                        <div className="bg-white/5 dark:bg-slate-50 px-4 py-3 rounded-2xl border border-white/10 dark:border-slate-100 text-center">
                                            <p className="text-[9px] font-black uppercase text-slate-500 opacity-60">Slot</p>
                                            <p className="text-sm font-black uppercase">{nextAppointment.timeSlot}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-auto pt-4 text-[10px] font-bold text-slate-400">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {nextAppointment.hospital}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center flex-grow py-10 opacity-60">
                                    <div className="w-16 h-16 bg-white/10 dark:bg-slate-50 rounded-full flex items-center justify-center mb-4 text-2xl">🏥</div>
                                    <p className="font-poppins font-black text-xs uppercase tracking-widest text-center">No Consults</p>
                                    <Link href="/dashboard/analyze" className="mt-4 text-[10px] font-bold underline hover:no-underline">Schedule a specialist</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 mb-4">💡</div>
                        <h4 className="font-poppins font-black text-sm text-slate-900 dark:text-white uppercase tracking-widest">Health Insight</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-barlow mt-2 leading-relaxed">
                            Consistent hydration and light cardio significantly improve liver regeneration markers. Keep moving!
                        </p>
                    </div>
                </aside>
            </div>

            {/* Structured Activities Row */}
            <section className="bg-white border border-slate-100 dark:bg-slate-950 dark:border-slate-800 rounded-[3rem] p-10 shadow-2xl shadow-slate-100 dark:shadow-none">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-poppins font-black text-slate-900 dark:text-white tracking-tight">Recent Scans</h2>
                        <p className="text-slate-500 font-barlow text-sm font-medium mt-1">Review and manage your healthcare history.</p>
                    </div>
                    <Link href="/dashboard/history" className="px-6 py-3 border-2 border-slate-100 hover:border-slate-900 hover:bg-slate-900 hover:text-white dark:border-slate-800 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all font-poppins">
                        Full Archive
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {recentRecords.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-slate-50/50 dark:bg-slate-900/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                           <p className="font-poppins font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">No diagnostic history found</p>
                        </div>
                    ) : (
                        recentRecords.map((record) => {
                            const isAbnormal = record.prediction === 1;
                            return (
                                <div key={record.id} className="group p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:shadow-2xl transition-all flex flex-col">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isAbnormal ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {isAbnormal ? "Check Required" : "Status Normal"}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 font-barlow">{new Date(record.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}</span>
                                    </div>
                                    <h4 className="font-poppins font-black text-slate-900 dark:text-white text-lg mb-1">{record.type} Report</h4>
                                    <p className="text-[10px] font-bold text-slate-400 font-barlow mb-8">Ref: {record.id.slice(0, 16)}</p>
                                    
                                    <div className="mt-auto grid grid-cols-2 gap-2">
                                        <Link href={`/dashboard/report/${record.id}`} 
                                            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 text-slate-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all">
                                            View
                                        </Link>
                                        <Link 
                                            href={`/dashboard/report/${record.id}/print`}
                                            target="_blank"
                                            className="px-4 py-3 border border-slate-100 hover:border-slate-900 dark:border-slate-800 dark:hover:border-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all text-slate-500">
                                            Print
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            <footer className="pt-12 text-center border-t border-slate-100 dark:border-slate-900">
                <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em] font-poppins">
                    DiagHeal Advanced Diagnostic Portal
                </p>
            </footer>
        </main>
    );
}
