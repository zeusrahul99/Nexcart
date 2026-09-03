import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function setupDatabaseUrl() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    try {
      const tmpDbPath = "/tmp/dev.db";
      if (!fs.existsSync(tmpDbPath)) {
        const possiblePaths = [
          path.join(process.cwd(), "prisma", "dev.db"),
          path.join(process.cwd(), "dev.db"),
        ];
        for (const p of possiblePaths) {
          if (fs.existsSync(p)) {
            fs.copyFileSync(p, tmpDbPath);
            break;
          }
        }
      }
      if (fs.existsSync(tmpDbPath)) {
        process.env.DATABASE_URL = `file:${tmpDbPath}`;
      }
    } catch (e) {
      console.error("Error setting up tmp database:", e);
    }
  }
}

setupDatabaseUrl();

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

