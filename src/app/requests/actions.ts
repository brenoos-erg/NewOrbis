"use server";

import { revalidatePath } from "next/cache";

import { DEFAULT_REQUESTER_ID } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { mapRequest } from "@/lib/mappers/request";
import type { PrismaRequestWithRelations } from "@/lib/mappers/request";
import { createRequestSchema } from "@/lib/validations/request";
import type {
  CreateRequestInput,
  CreateRequestPayload,
  RequestValidationErrors,
  RequestWithAssignees
} from "@/types/request";

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

export async function listRequests(): Promise<RequestWithAssignees[]> {
  const requests = await fetchRequests();
  return requests.map(mapRequest);
}

export type CreateRequestResult =
  | { success: true }
  | { success: false; errors: RequestValidationErrors }
  | { success: false; message: string };

export async function createRequest(payload: CreateRequestPayload): Promise<CreateRequestResult> {
  const validation = createRequestSchema.safeParse(payload);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors
    };
  }

  const data: CreateRequestInput = validation.data;

  try {
    await prisma.request.create({
      data: {
        ...data,
        requesterId: DEFAULT_REQUESTER_ID
      }
    });
  } catch (error) {
    console.error("Erro ao registrar solicitação", error);
    return {
      success: false,
      message: "Não foi possível registrar a solicitação."
    };
  }

  revalidatePath("/requests");
  return { success: true };
}
