export type RequestStatus = "aberta" | "em_andamento" | "concluida" | "cancelada";
export type RequestCategory = "ferias" | "admissao" | "desligamento" | "beneficios" | "outros";
export type RequestPriority = "baixa" | "media" | "alta";
export type RequestDepartment = "RH" | "DP";

export interface Request {
  id: string;
  title: string;
  description: string;
  category: RequestCategory;
  requesterId: string;
  department: RequestDepartment;
  status: RequestStatus;
  priority: RequestPriority;
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
  department: RequestDepartment;
  priority: RequestPriority;
}

export type RequestValidationErrors = Record<string, string[] | undefined>;
