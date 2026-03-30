export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// Params ko Promise define karna zaroori hai Next.js 15+ mein
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Yahan Promise add kiya
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Params ko await karo ID nikalne ke liye
    const { id } = await params; 

    // 2. Ab 'id' variable ko use karo
    await prisma.record.delete({
      where: { 
        id: id, 
        userId: session.user.id 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE record error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}