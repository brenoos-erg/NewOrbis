"use client";

import { useMemo, useState } from "react";

import type { RequestWithAssignees } from "@/types/request";

interface RequestListProps {
  requests: RequestWithAssignees[];
}

const statusLabels: Record<RequestWithAssignees["status"], string> = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  cancelada: "Cancelada"
};

export function RequestList({ requests }: RequestListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestWithAssignees["status"] | "todos">("todos");

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchSearch = request.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "todos" || request.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, search, statusFilter]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Solicitações recentes</h2>
          <p className="text-xs text-slate-500">Visualize e acompanhe as demandas de RH e DP em tempo real.</p>
        </div>
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as RequestWithAssignees["status"] | "todos")}
          >
            <option value="todos">Todos os status</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <input
            className="w-48 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Buscar por título"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </header>

      <div className="mt-4 space-y-4">
        {filteredRequests.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500">
            Nenhuma solicitação encontrada com os filtros atuais.
          </p>
        ) : (
          filteredRequests.map((request) => (
            <article key={request.id} className="rounded-xl border border-slate-200 p-4 shadow-sm">
              <header className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                  {request.department}
                </span>
                <h3 className="text-base font-semibold text-slate-900">{request.title}</h3>
                <span className="ml-auto rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500">
                  {statusLabels[request.status]}
                </span>
              </header>
              <p className="mt-3 text-sm text-slate-600">{request.description}</p>
              <footer className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>Categoria: {request.category}</span>
                <span>Prioridade: {request.priority}</span>
                <span>Criada em: {new Date(request.createdAt).toLocaleDateString("pt-BR")}</span>
                {request.slaDueAt && <span>SLA: {new Date(request.slaDueAt).toLocaleDateString("pt-BR")}</span>}
                {request.assignees.length > 0 && (
                  <span>
                    Responsáveis: {request.assignees.map((assignee) => assignee.name).join(", ")}
                  </span>
                )}
              </footer>
            </article>
          ))
        )}
      </div>
    </section>
  );
}