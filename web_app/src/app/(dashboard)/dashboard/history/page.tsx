export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import HistoryTable from "./HistoryTable";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const records = await prisma.record.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Medical History</h1>
        <p className="text-slate-500 mt-2">View and manage your previous health analysis reports.</p>
      </div>
      <HistoryTable initialRecords={records} />
    </main>
  );
}