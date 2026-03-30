import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: isBuildPhase ? undefined : PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})