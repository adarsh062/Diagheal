import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const recordId = params.id;
    await prisma.record.delete({
      where: { id: recordId, userId: session.user.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE record error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
