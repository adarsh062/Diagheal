import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { 
      doctorName, 
      specialty, 
      hospital, 
      date, 
      timeSlot 
    } = data;

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
    console.error("POST appointment error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
