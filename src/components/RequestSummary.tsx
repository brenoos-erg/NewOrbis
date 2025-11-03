import type { RequestWithAssignees } from "@/types/request";

interface RequestSummaryProps {
  requests: RequestWithAssignees[];
}

const statusLabels: Record<RequestWithAssignees["status"], string> = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  cancelada: "Cancelada"
};

export function RequestSummary({ requests }: RequestSummaryProps) {
  const total = requests.length;
  const byStatus = requests.reduce<Record<string, number>>((acc, request) => {
    acc[request.status] = (acc[request.status] ?? 0) + 1;
    return acc;
  }, {});

  const byDepartment = requests.reduce<Record<string, number>>((acc, request) => {
    acc[request.department] = (acc[request.department] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <aside className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Resumo</h2>
        <p className="mt-1 text-xs text-slate-500">Visão geral da carga atual de solicitações.</p>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Total</span>
            <strong className="text-base text-slate-900">{total}</strong>
          </div>
          {Object.entries(statusLabels).map(([status, label]) => (
            <div key={status} className="flex items-center justify-between">
              <span>{label}</span>
              <span>{byStatus[status] ?? 0}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Departamentos</h2>
        <p className="mt-1 text-xs text-slate-500">Distribuição das solicitações por área.</p>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          {["RH", "DP"].map((department) => (
            <div key={department} className="flex items-center justify-between">
              <span>{department}</span>
              <span>{byDepartment[department] ?? 0}</span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
