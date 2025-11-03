import type { Prisma } from "@prisma/client";

import type { RequestWithAssignees } from "@/types/request";

export type PrismaRequestWithRelations = Prisma.RequestGetPayload<{
  include: {
    assignees: {
      include: {
        profile: true;
      };
    };
  };
}>;

export function mapRequest(request: PrismaRequestWithRelations): RequestWithAssignees {
  return {
    id: request.id,
    title: request.title,
    description: request.description,
    category: request.category,
    requesterId: request.requesterId,
    department: request.department,
    status: request.status,
    priority: request.priority,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
    slaDueAt: request.slaDueAt?.toISOString() ?? null,
    assignees: request.assignees.map((assignee) => ({
      id: assignee.profile?.id ?? assignee.id,
      name: assignee.profile?.fullName ?? "Responsável",
      avatarUrl: assignee.profile?.avatarUrl ?? null
    }))
  };
}