# NewOrbis

Portal web para abertura, acompanhamento e gestão de solicitações de Recursos Humanos (RH) e Departamento Pessoal (DP).

## 📦 Stack

- [Next.js 14](https://nextjs.org/) com App Router e Server Actions
- [React 18](https://react.dev/) + [React Hook Form](https://react-hook-form.com/) para formulários
- [Zod](https://zod.dev/) para validação
- [Prisma ORM](https://www.prisma.io/) com PostgreSQL executando em um container Docker local

## 🚀 Como executar o projeto localmente

1. **Suba o banco de dados local**

   O projeto inclui um `docker-compose.yml` para subir um PostgreSQL configurado com usuário e senha padrão `postgres`.

   ```bash
   docker compose up -d
   ```

2. **Configure as variáveis de ambiente**

   Copie o arquivo `.env.example` para `.env` (ou `.env.local` se preferir) e ajuste a URL do banco caso necessário.

   ```bash
   cp .env.example .env
   ```

3. **Instale as dependências**

   ```bash
   pnpm install
   # ou npm install / yarn install
   ```

4. **Execute as migrações e o seed**

   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

   > Caso seja o primeiro contato com o Prisma, rode `npx prisma generate` para garantir que o cliente foi gerado.

5. **Execute o projeto**

   ```bash
   pnpm dev
   ```

   A aplicação estará disponível em `http://localhost:3000`.

## 🧭 Funcionalidades do MVP

- Landing page com visão geral do portal.
- Painel `/requests` para listar e filtrar solicitações de RH/DP.
- Formulário com validação para abertura de novas solicitações.
- Persistência via Prisma + PostgreSQL local.

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

- Implementar autenticação com NextAuth ou outra solução integrada ao PostgreSQL.
- Incluir etapa de aprovação multi-nível com SLA e registro de timeline.
- Adicionar notificações por e-mail (Resend, Postmark, etc.).
- Construir dashboards com métricas de SLA, volume por categoria e tempo médio de atendimento.

## 📚 Documentação complementar

- [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md) — guia detalhado da stack local com Docker, Prisma e scripts úteis.

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` (a ser adicionada) para mais informações.