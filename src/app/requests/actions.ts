"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabaseClient";
import type { CreateRequestPayload } from "@/types/request";

const createRequestSchema = z.object({
  title: z.string().min(3, "Informe um título com pelo menos 3 caracteres."),
  description: z.string().min(10, "Descreva a solicitação com mais detalhes."),
  category: z.enum(["ferias", "admissao", "desligamento", "beneficios", "outros"]),
  department: z.enum(["RH", "DP"]),
  priority: z.enum(["baixa", "media", "alta"])
});

export async function listRequests() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*, assignees:request_assignees(id, profiles(full_name, avatar_url)))")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar solicitações", error);
    throw new Error("Não foi possível carregar as solicitações.");
  }

  return (
    data?.map((request) => ({
      id: request.id,
      title: request.title,
      description: request.description,
      category: request.category,
      requesterId: request.requester_id,
      department: request.department,
      status: request.status,
      priority: request.priority,
      createdAt: request.created_at,
      updatedAt: request.updated_at,
      slaDueAt: request.sla_due_at,
      assignees:
        request.assignees?.map((assignee: any) => ({
          id: assignee.id,
          name: assignee.profiles?.full_name ?? "Responsável",
          avatarUrl: assignee.profiles?.avatar_url ?? null
        })) ?? []
    })) ?? []
  );
}

export async function createRequest(payload: CreateRequestPayload) {
  const validation = createRequestSchema.safeParse(payload);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors
    } as const;
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      success: false,
      message: "É necessário estar autenticado para registrar uma solicitação."
    } as const;
  }

  const { error: insertError } = await supabase.from("requests").insert({
    title: payload.title,
    description: payload.description,
    category: payload.category,
    department: payload.department,
    priority: payload.priority,
    requester_id: data.user.id,
    status: "aberta"
  });

  if (insertError) {
    console.error("Erro ao criar solicitação", insertError);
    return {
      success: false,
      message: "Não foi possível registrar a solicitação. Tente novamente."
    } as const;
  }

  revalidatePath("/requests");
  return { success: true } as const;
}
