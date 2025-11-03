+32
-0

export type RequestStatus = "aberta" | "em_andamento" | "concluida" | "cancelada";
export type RequestCategory = "ferias" | "admissao" | "desligamento" | "beneficios" | "outros";

export interface Request {
  id: string;
  title: string;
  description: string;
  category: RequestCategory;
  requesterId: string;
  department: "RH" | "DP";
  status: RequestStatus;
  priority: "baixa" | "media" | "alta";
  createdAt: string;
  updatedAt: string;
  slaDueAt?: string | null;
}

export interface RequestWithAssignees extends Request {
  assignees: Array<{
    id: string;
    name: string;
    avatarUrl?: string | null;
  }>;
}

export interface CreateRequestPayload {
  title: string;
  description: string;
  category: RequestCategory;
  department: "RH" | "DP";
  priority: "baixa" | "media" | "alta";
}