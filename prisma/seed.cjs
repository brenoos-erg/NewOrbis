const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const requesterId = process.env.DEFAULT_REQUESTER_ID ?? "local-user";

  const [ana, bruno] = await Promise.all([
    prisma.profile.upsert({
      where: { id: "profile-ana" },
      update: {
        fullName: "Ana Souza",
        department: "RH",
      },
      create: {
        id: "profile-ana",
        fullName: "Ana Souza",
        department: "RH",
      },
    }),
    prisma.profile.upsert({
      where: { id: "profile-bruno" },
      update: {
        fullName: "Bruno Lima",
        department: "DP",
      },
      create: {
        id: "profile-bruno",
        fullName: "Bruno Lima",
        department: "DP",
      },
    }),
  ]);

  const existingRequests = await prisma.request.count();
  if (existingRequests > 0) {
    console.log("ℹ️  Solicitações já existentes. Nenhum seed adicional foi aplicado.");
    return;
  }

  const onboarding = await prisma.request.create({
    data: {
      title: "Onboarding de novo colaborador",
      description: "Organizar processo de integração para o novo analista de marketing.",
      category: "admissao",
      department: "RH",
      priority: "alta",
      requesterId,
      status: "em_andamento",
    },
  });

  await prisma.requestAssignee.create({
    data: {
      requestId: onboarding.id,
      profileId: ana.id,
    },
  });

  const benefits = await prisma.request.create({
    data: {
      title: "Ajuste de benefícios",
      description: "Atualizar plano de saúde dos colaboradores do time financeiro.",
      category: "beneficios",
      department: "DP",
      priority: "media",
      requesterId,
    },
  });

  await prisma.requestAssignee.create({
    data: {
      requestId: benefits.id,
      profileId: bruno.id,
    },
  });

  console.log("✅ Banco populado com sucesso!");
}

main()
  .catch((error) => {
    console.error("❌ Falha ao executar o seed do banco:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });