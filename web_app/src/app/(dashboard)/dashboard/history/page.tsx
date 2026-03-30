import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import HistoryTable from "./HistoryTable";

export default async function HistoryPage() {
  const session = await auth();
  
  // Security check: Only authenticated users can see their records
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch only the records belonging to the currently logged-in user
  const records = await prisma.record.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-8">
      <header className="mb-8 max-w-4xl">
         <h1 className="text-3xl font-poppins font-semibold text-black mb-2 flex items-center gap-3">
           <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
           </svg>
           Medical History
         </h1>
         <p className="text-gray-600 font-barlow text-sm">
           Secure archive of all your past liver scan analyses. These records are end-to-end encrypted and visible <span className="font-bold text-gray-800">only to you</span>.
         </p>
      </header>

      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-6 sm:p-8 shadow-lg overflow-hidden">
         <HistoryTable initialRecords={records} />
      </div>
    </main>
  );
}
