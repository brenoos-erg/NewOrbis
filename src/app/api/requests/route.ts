import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabaseClient";
import type { CreateRequestPayload } from "@/types/request";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*, assignees:request_assignees(id, profiles(full_name, avatar_url)))")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: "Não foi possível carregar as solicitações" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateRequestPayload;
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const { error: insertError } = await supabase.from("requests").insert({
    title: body.title,
    description: body.description,
    category: body.category,
    department: body.department,
    priority: body.priority,
    requester_id: data.user.id,
    status: "aberta"
  });

  if (insertError) {
    return NextResponse.json({ message: "Erro ao registrar solicitação" }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}