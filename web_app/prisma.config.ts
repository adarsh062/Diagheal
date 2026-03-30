import { config } from "dotenv";
config({ path: ".env.local" });
import { defineConfig } from "@prisma/config";

export default defineConfig({
  // 'earlyAccess' hata do agar error de raha hai, naye patch mein ye default ho gaya hai
  schema: "./prisma/schema.prisma", 
  datasource: {
    // URL ko string confirm karne ke liye ye use karo
    url: process.env.DATABASE_URL as string,
  },
});