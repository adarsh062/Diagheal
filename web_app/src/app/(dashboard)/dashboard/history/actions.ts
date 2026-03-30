"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteRecord(recordId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await prisma.record.delete({
    where: { id: recordId, userId: session.user.id }
  });
  revalidatePath("/dashboard/history");
}
