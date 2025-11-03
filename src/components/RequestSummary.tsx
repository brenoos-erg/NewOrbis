import type { RequestDepartment, RequestStatus, RequestWithAssignees } from "@/types/request";

interface RequestSummaryProps {
  requests: RequestWithAssignees[];
}

const statusLabels: Record<RequestStatus, string> = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  cancelada: "Cancelada"
};

const departments: RequestDepartment[] = ["RH", "DP"];

export function RequestSummary({ requests }: RequestSummaryProps) {
  const totals = requests.reduce(
    (acc, request) => {
      acc.total += 1;
      acc.byStatus[request.status] = (acc.byStatus[request.status] ?? 0) + 1;
      acc.byDepartment[request.department] = (acc.byDepartment[request.department] ?? 0) + 1;
      return acc;
    },
    {
      total: 0,
      byStatus: {} as Record<RequestStatus, number>,
      byDepartment: {} as Record<RequestDepartment, number>
    }
  );

  return (
    <aside className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Resumo</h2>
        <p className="mt-1 text-xs text-slate-500">Visão geral da carga atual de solicitações.</p>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Total</span>
            <strong className="text-base text-slate-900">{totals.total}</strong>
          </div>
          {Object.entries(statusLabels).map(([status, label]) => (
            <div key={status} className="flex items-center justify-between">
              <span>{label}</span>
              <span>{totals.byStatus[status as RequestStatus] ?? 0}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Departamentos</h2>
        <p className="mt-1 text-xs text-slate-500">Distribuição das solicitações por área.</p>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          {departments.map((department) => (
            <div key={department} className="flex items-center justify-between">
              <span>{department}</span>
              <span>{totals.byDepartment[department] ?? 0}</span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
