export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  // 1. Build phase check (Sabse upar)
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json([]);
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. LAZY IMPORT: Prisma ko sirf yahan load karo
    const { default: prisma } = await import("@/lib/prisma");

    const appointments = await prisma.appointment.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("GET appointments error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ message: "Build skipped" });
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { default: prisma } = await import("@/lib/prisma");
    const body = await req.json();

    const appointment = await prisma.appointment.create({
      data: {
        doctorName: body.doctorName,
        specialty: body.specialty,
        hospital: body.hospital,
        date: new Date(body.date),
        timeSlot: body.timeSlot,
        userId: session.user.id,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}