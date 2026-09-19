import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const connectionString = process.env.DATABASE_URL;

if (!email || !password || !connectionString) {
  throw new Error("ADMIN_EMAIL, ADMIN_PASSWORD ve DATABASE_URL tanımlanmalıdır.");
}

if (password.length < 8) {
  throw new Error("Admin şifresi en az 8 karakter olmalıdır.");
}

const createAdmin = async () => {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const passwordHash = await hash(password, 12);
    await prisma.admin.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash },
    });
    console.log(`Admin hesabı hazır: ${email}`);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
