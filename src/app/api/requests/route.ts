import { NextResponse } from "next/server";

import { DEFAULT_REQUESTER_ID } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { mapRequest } from "@/lib/mappers/request";
import type { PrismaRequestWithRelations } from "@/lib/mappers/request";
import { createRequestSchema } from "@/lib/validations/request";

async function fetchRequests(): Promise<PrismaRequestWithRelations[]> {
  return prisma.request.findMany({
    include: {
      assignees: {
        include: {
          profile: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function GET() {
  try {
    const requests = await fetchRequests();
    return NextResponse.json(requests.map(mapRequest));
  } catch (error) {
    console.error("Erro ao carregar solicitações", error);
    return NextResponse.json(
      { message: "Não foi possível carregar as solicitações." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    console.error("Erro ao processar JSON da requisição", error);
    return NextResponse.json({ message: "Payload inválido." }, { status: 400 });
  }

  const validation = createRequestSchema.safeParse(payload);
  if (!validation.success) {
    return NextResponse.json(
      { message: "Dados inválidos", errors: validation.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const created = await prisma.request.create({
      data: {
        ...validation.data,
        requesterId: DEFAULT_REQUESTER_ID
      },
      include: {
        assignees: {
          include: {
            profile: true
          }
        }
      }
    });

    return NextResponse.json(mapRequest(created), { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar solicitação", error);
    return NextResponse.json({ message: "Erro ao registrar solicitação." }, { status: 500 });
  }
}