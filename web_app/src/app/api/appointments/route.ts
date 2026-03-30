export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// Zyada robust check
const isBuildPhase = 
  process.env.NEXT_PHASE === 'phase-production-build' || 
  process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL;

export async function GET() {
  // Build time protection: Prisma initialize hone se pehle return kar do
  if (isBuildPhase) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
  if (isBuildPhase) {
    return NextResponse.json({ message: "Build skipped" }, { status: 200 });
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { doctorName, specialty, hospital, date, timeSlot } = body;

    if (!doctorName || !date || !timeSlot) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        doctorName,
        specialty,
        hospital,
        date: new Date(date),
        timeSlot,
        userId: session.user.id,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}