# NewOrbis

Portal web para abertura, acompanhamento e gestão de solicitações de Recursos Humanos (RH) e Departamento Pessoal (DP).

## 📦 Stack

- [Next.js 14](https://nextjs.org/) com App Router e Server Actions
- [React 18](https://react.dev/) + [React Hook Form](https://react-hook-form.com/) para formulários
- [Zod](https://zod.dev/) para validação
- [Supabase](https://supabase.com/) como banco de dados PostgreSQL gerenciado, autenticação e storage

## 🚀 Começando

1. **Configure o Supabase**
   - Crie um projeto em [app.supabase.com](https://app.supabase.com/).
   - Copie as variáveis `Project URL` e `anon key` em `Project Settings > API`.
   - Execute o script de migração `supabase/migrations/20240501120000_initial_schema.sql` através do SQL editor do Supabase para criar tabelas, relacionamentos e políticas de segurança.

2. **Configure as variáveis de ambiente**

   Crie um arquivo `.env.local` na raiz do projeto com:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL="https://<sua-instancia>.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<sua-anon-key>"
   ```

3. **Instale as dependências**

   ```bash
   pnpm install
   # ou npm install / yarn install
   ```

4. **Execute o projeto**

   ```bash
   pnpm dev
   ```

   A aplicação estará disponível em `http://localhost:3000`.

## 🧭 Funcionalidades do MVP

- Landing page com visão geral do portal.
- Painel `/requests` para listar e filtrar solicitações de RH/DP.
- Formulário com validação para abertura de novas solicitações.
- Integração com Supabase usando Server Actions para listar/criar registros.
- Migração SQL com tabelas, relacionamentos e políticas de Row Level Security (RLS), incluindo perfis sincronizados com o Supabase Auth.

## 📤 Publicar no seu repositório

Depois de clonar este projeto e aplicar as suas alterações, você pode enviar tudo de uma vez para o seu repositório remoto:

```bash
git remote add origin https://github.com/sua-conta/seu-repo.git  # configure o remote apenas uma vez
git add .
git commit -m "feat: inicializa portal de solicitações"
git push -u origin main
```

Se o repositório remoto já existir com histórico, faça `git pull` antes do `push` para sincronizar.

## 🗺️ Próximos passos sugeridos

- Implementar autenticação com Supabase Auth (magic link ou SSO corporativo) utilizando os perfis criados automaticamente na migração.
- Incluir etapa de aprovação multi-nível com SLA e registro de timeline.
- Adicionar notificações por e-mail (Supabase Functions + Postmark/Resend).
- Construir dashboards com métricas de SLA, volume por categoria e tempo médio de atendimento.

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` (a ser adicionada) para mais informações.