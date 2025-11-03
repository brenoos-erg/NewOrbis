"use client";

import { useMemo, useState } from "react";

import type { RequestWithAssignees, RequestStatus } from "@/types/request";

interface RequestListProps {
  requests: RequestWithAssignees[];
}

const statusLabels: Record<RequestStatus, string> = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  cancelada: "Cancelada"
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR");

export function RequestList({ requests }: RequestListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "todos">("todos");

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchSearch =
        normalizedSearch.length === 0 || request.title.toLowerCase().includes(normalizedSearch);
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            aria-label="Filtrar por status"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as RequestStatus | "todos")}
          >
            <option value="todos">Todos os status</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <input
            aria-label="Buscar solicitação por título"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm sm:w-48"
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
                <span>Criada em: {dateFormatter.format(new Date(request.createdAt))}</span>
                {request.slaDueAt && <span>SLA: {dateFormatter.format(new Date(request.slaDueAt))}</span>}
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
