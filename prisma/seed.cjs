// prisma/seed.cjs
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Usuário inicial
  const user = await prisma.user.upsert({
    where: { email: "demo@empresa.com" },
    update: {},
    create: {
      name: "Usuário Demo",
      email: "demo@empresa.com",
      role: "EMPLOYEE",
    },
  });

  // Categorias e Subcategorias
  const rh = await prisma.category.upsert({
    where: { name: "SERVIÇOS DE RH" },
    update: {},
    create: { name: "SERVIÇOS DE RH", defaultSlaHours: 48 },
  });

  const dp = await prisma.category.upsert({
    where: { name: "DEPARTAMENTO PESSOAL" },
    update: {},
    create: { name: "DEPARTAMENTO PESSOAL", defaultSlaHours: 72 },
  });

  await prisma.subcategory.upsert({
    where: { name_categoryId: { name: "Admissão", categoryId: rh.id } },
    update: {},
    create: { name: "Admissão", categoryId: rh.id },
  });

  await prisma.subcategory.upsert({
    where: { name_categoryId: { name: "Folha de Pagamento", categoryId: dp.id } },
    update: {},
    create: { name: "Folha de Pagamento", categoryId: dp.id },
  });

  console.log("✅ Banco populado com sucesso!");
  console.table({ user: user.email, categorias: [rh.name, dp.name] });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
