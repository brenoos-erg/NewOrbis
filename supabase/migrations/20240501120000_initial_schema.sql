-- Extensões necessárias
create extension if not exists "pgcrypto";

-- Função utilitária para atualizar coluna updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tabela de perfis sincronizada com auth.users
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text,
  department text check (department is null or department in ('RH', 'DP')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_user_id_unique unique (user_id)
);

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

-- Trigger para criar perfis automaticamente após novo usuário
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

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

-- Habilita Row Level Security
alter table public.profiles enable row level security;
alter table public.requests enable row level security;
alter table public.request_assignees enable row level security;
alter table public.request_comments enable row level security;

-- Políticas da tabela profiles
create policy "Usuário visualiza seu perfil" on public.profiles
  for select using (auth.uid() = user_id);

create policy "Usuário atualiza seu perfil" on public.profiles
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Políticas da tabela requests
create policy "Usuários visualizam solicitações do seu departamento" on public.requests
  for select using (
    auth.uid() = requester_id
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

-- Políticas da tabela request_assignees
create policy "Visualizar responsáveis vinculados" on public.request_assignees
  for select using (
    exists (
      select 1
      from public.requests r
      where r.id = request_assignees.request_id
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

create policy "Adicionar responsáveis ao pedido" on public.request_assignees
  for insert with check (
    exists (
      select 1
      from public.requests r
      join public.profiles profile on profile.id = request_assignees.profile_id
      where r.id = request_assignees.request_id
        and (
          r.requester_id = auth.uid()
          or profile.user_id = auth.uid()
        )
    )
  );

-- Políticas da tabela request_comments
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