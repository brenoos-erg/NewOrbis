-- Tabela principal de solicitações
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null check (category in ('ferias', 'admissao', 'desligamento', 'beneficios', 'outros')),
  department text not null check (department in ('RH', 'DP')),
  status text not null default 'aberta' check (status in ('aberta', 'em_andamento', 'concluida', 'cancelada')),
  priority text not null default 'media' check (priority in ('baixa', 'media', 'alta')),
  requester_id uuid not null references auth.users (id),
  sla_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger handle_requests_updated_at
  before update on public.requests
  for each row
  execute procedure public.handle_updated_at();

-- Tabela de responsáveis das solicitações
create table if not exists public.request_assignees (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Tabela de comentários
create table if not exists public.request_comments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests (id) on delete cascade,
  author_id uuid not null references auth.users (id),
  content text not null,
  created_at timestamptz not null default now()
);

-- Políticas de Row Level Security
alter table public.requests enable row level security;
alter table public.request_assignees enable row level security;
alter table public.request_comments enable row level security;

create policy "Usuários visualizam solicitações do seu departamento" on public.requests
  for select using (
    (auth.uid() = requester_id)
    or exists (
      select 1
      from public.request_assignees ra
      join public.profiles p on p.id = ra.profile_id
      where ra.request_id = requests.id
        and p.department = requests.department
        and p.user_id = auth.uid()
    )
  );

create policy "Usuários criam suas próprias solicitações" on public.requests
  for insert with check (auth.uid() = requester_id);

create policy "Responsáveis atualizam solicitações" on public.requests
  for update using (
    exists (
      select 1
      from public.request_assignees ra
      join public.profiles p on p.id = ra.profile_id
      where ra.request_id = requests.id
        and p.user_id = auth.uid()
    )
  );

create policy "Colaboradores cadastrados adicionam comentários" on public.request_comments
  for insert with check (auth.uid() = author_id);

create policy "Visualização de comentários associada à solicitação" on public.request_comments
  for select using (
    exists (
      select 1
      from public.requests r
      where r.id = request_comments.request_id
        and (
          r.requester_id = auth.uid()
          or exists (
            select 1
            from public.request_assignees ra
            join public.profiles p on p.id = ra.profile_id
            where ra.request_id = r.id
              and p.user_id = auth.uid()
          )
        )
    )
  );
