import Link from "next/link";

const features = [
  {
    title: "Centralização",
    description:
      "Organize todas as solicitações do RH e DP em um único painel com filtros por status e categoria."
  },
  {
    title: "Fluxos configuráveis",
    description:
      "Defina etapas de aprovação personalizadas com responsáveis, prazos e SLA por tipo de solicitação."
  },
  {
    title: "Notificações inteligentes",
    description:
      "Mantenha colaboradores informados com alertas em tempo real via e-mail e painel web."
  }
];

export default function HomePage() {
  return (
    <section className="space-y-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Portal de solicitações RH & DP</h2>
        <p className="mt-4 text-base text-slate-600">
          Bem-vindo ao NewOrbis. Concentre e acompanhe pedidos de férias, admissões, desligamentos e demais
          rotinas do RH e Departamento Pessoal com transparência e segurança.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            href="/requests"
          >
            Acessar painel de solicitações
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-6 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300"
            href="/docs/guia-implantacao"
          >
            Guia de implantação
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
