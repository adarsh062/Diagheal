export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import HistoryTable from "./HistoryTable";
import { Record as RecordModel } from "@prisma/client";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  let records: RecordModel[] = [];

  try {
    records = await prisma.record.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("History fetch error:", error);
  }

  return (
    <main className="p-8">
      <header className="mb-8 max-w-4xl">
        <h1 className="text-3xl font-poppins font-semibold text-black mb-2">
          Medical History
        </h1>
      </header>

      <div>
        <HistoryTable initialRecords={records} />
      </div>
    </main>
  );
}