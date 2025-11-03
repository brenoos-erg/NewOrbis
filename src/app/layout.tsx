import type { Metadata } from "next";
import "@/app/styles.css";

export const metadata: Metadata = {
  title: "NewOrbis | Solicitações RH & DP",
  description: "Portal unificado para solicitações de Recursos Humanos e Departamento Pessoal"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8">
          <header className="mb-10 border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-semibold text-slate-900">NewOrbis</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Sistema web para abertura, acompanhamento e gestão de solicitações de RH e DP.
            </p>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-12 border-t border-slate-200 pt-6 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} NewOrbis. Todos os direitos reservados.
          </footer>
        </div>
      </body>
    </html>
  );
}