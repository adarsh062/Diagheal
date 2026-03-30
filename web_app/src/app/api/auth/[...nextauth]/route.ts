export const dynamic = "force-dynamic";
import { handlers } from "@/auth";
import { NextRequest } from "next/server";

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

export const GET = (req: NextRequest) => {
  if (isBuildPhase) return new Response("OK", { status: 200 });
  return handlers.GET(req);
};

export const POST = (req: NextRequest) => {
  if (isBuildPhase) return new Response("OK", { status: 200 });
  return handlers.POST(req);
};