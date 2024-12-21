import { prismaClient } from "../src/application/db.js";
import bcrypt from "bcrypt";

async function main() {
  const adminExists = await prismaClient.user.findFirst({
    where: { is_admin: true },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prismaClient.user.create({
      data: {
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        phone: "08123456789",
        nik: "1234567890123456",
        gender: "LAKI_LAKI",
        address: "Bekasi",
        is_admin: true,
      },
    });

    console.log("Admin default berhasil dibuat.");
  } else {
    console.log("Admin sudah ada, seeder dilewati.");
  }
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
