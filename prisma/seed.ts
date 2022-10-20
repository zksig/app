import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.userProfile.upsert({
    where: { email: "dev@zksig.io" },
    update: {},
    create: { email: "dev@zksig.io" },
  });
}
main()
  .then(async () => {
    console.log("Seed Complete ✅");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
