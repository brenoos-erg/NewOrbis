"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createRequest } from "@/app/requests/actions";
import type { CreateRequestPayload } from "@/types/request";

const requestSchema = z.object({
  title: z.string().min(3, "Informe pelo menos 3 caracteres"),
  description: z.string().min(10, "Descreva com mais detalhes"),
  category: z.enum(["ferias", "admissao", "desligamento", "beneficios", "outros"]),
  department: z.enum(["RH", "DP"]),
  priority: z.enum(["baixa", "media", "alta"])
});

type RequestFormData = z.infer<typeof requestSchema>;

export function RequestWizard() {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      department: "RH",
      priority: "media",
      category: "outros"
    }
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      setFeedback(null);
      const result = await createRequest(data as CreateRequestPayload);

      if (!result.success) {
        if ("errors" in result && result.errors) {
          setFeedback("Revise os campos destacados e tente novamente.");
        } else {
          setFeedback(result.message ?? "Não foi possível registrar a solicitação.");
        }
        return;
      }

      setFeedback("Solicitação registrada com sucesso!");
      reset({
        title: "",
        description: "",
        department: "RH",
        priority: "media",
        category: "outros"
      });
    });
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">Abrir nova solicitação</h2>
        <p className="text-xs text-slate-500">
          Informe os detalhes da demanda para que a equipe responsável possa atuar com agilidade.
        </p>
      </header>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="title">
            Título
          </label>
          <input
            id="title"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Ex.: Solicitação de férias"
            {...register("title")}
          />
          {errors.title && <span className="text-xs text-red-600">{errors.title.message}</span>}
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="description">
            Descrição
          </label>
          <textarea
            id="description"
            className="min-h-[120px] rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Explique o contexto, datas, anexos necessários, etc."
            {...register("description")}
          />
          {errors.description && <span className="text-xs text-red-600">{errors.description.message}</span>}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="grid gap-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="category">
              Categoria
            </label>
            <select id="category" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" {...register("category")}>
              <option value="ferias">Férias</option>
              <option value="admissao">Admissão</option>
              <option value="desligamento">Desligamento</option>
              <option value="beneficios">Benefícios</option>
              <option value="outros">Outros</option>
            </select>
            {errors.category && <span className="text-xs text-red-600">{errors.category.message}</span>}
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="department">
              Departamento
            </label>
            <select id="department" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" {...register("department")}>
              <option value="RH">RH</option>
              <option value="DP">DP</option>
            </select>
            {errors.department && <span className="text-xs text-red-600">{errors.department.message}</span>}
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="priority">
              Prioridade
            </label>
            <select id="priority" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" {...register("priority")}>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            {errors.priority && <span className="text-xs text-red-600">{errors.priority.message}</span>}
          </div>
        </div>

        {feedback && <p className="text-sm text-slate-600">{feedback}</p>}

        <button
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Registrando..." : "Registrar solicitação"}
        </button>
      </form>
    </section>
  );
}