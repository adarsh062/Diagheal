export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const records = await prisma.record.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("GET records error:", error);
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 });
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
      type = "LIVER", 
      prediction, 
      confidence, 
      age, 
      gender, 
      tb, 
      db, 
      alkphos, 
      sgpt, 
      sgot, 
      tp, 
      alb, 
      agRatio,
      summary,
      recommendations
    } = data;

    // Type casting and cleaning values
    const record = await prisma.record.create({
      data: {
        type,
        prediction: Number(prediction),
        confidence: Number(confidence),
        age: age ? Number(age) : null,
        gender: gender || null,
        tb: tb ? Number(tb) : null,
        db: db ? Number(db) : null,
        alkphos: alkphos ? Number(alkphos) : null,
        sgpt: sgpt ? Number(sgpt) : null,
        sgot: sgot ? Number(sgot) : null,
        tp: tp ? Number(tp) : null,
        alb: alb ? Number(alb) : null,
        agRatio: agRatio ? Number(agRatio) : null,
        summary: summary || null,
        recommendations: recommendations || null,
        userId: session.user.id,
      },
    });


    return NextResponse.json(record);
  } catch (error) {
    console.error("POST record error:", error);
    return NextResponse.json({ error: "Failed to store record" }, { status: 500 });
  }
}
