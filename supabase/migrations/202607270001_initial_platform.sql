-- Dynamis Flow: multi-tenant project operations foundation.
-- Every public table is protected by RLS. No service-role key is required by the client.

create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create type public.organization_role as enum ('owner', 'admin', 'member', 'guest');
create type public.project_access as enum ('organization', 'private');
create type public.task_priority as enum ('urgent', 'high', 'medium', 'low', 'none');
create type public.notification_kind as enum ('mention', 'assignment', 'comment', 'status_change', 'due_date', 'system');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  job_title text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  logo_url text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_role not null default 'member',
  joined_at timestamptz not null default now(),
  invited_by uuid references auth.users(id),
  primary key (organization_id, user_id)
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  description text,
  color text not null default '#6d54df',
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table public.team_members (
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  name text not null check (char_length(name) between 2 and 120),
  key text not null check (key ~ '^[A-Z][A-Z0-9]{1,7}$'),
  description text,
  color text not null default '#6d54df',
  icon text,
  access public.project_access not null default 'organization',
  start_date date,
  target_date date,
  archived_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, key)
);

create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  can_edit boolean not null default false,
  added_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table public.task_statuses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  color text not null default '#9b97a1',
  position integer not null default 0,
  category text not null default 'unstarted' check (category in ('backlog', 'unstarted', 'started', 'completed', 'cancelled')),
  unique (project_id, name)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  status_id uuid not null references public.task_statuses(id),
  task_number bigint generated always as identity,
  title text not null check (char_length(title) between 1 and 300),
  description text,
  priority public.task_priority not null default 'none',
  parent_task_id uuid references public.tasks(id) on delete cascade,
  due_at timestamptz,
  start_at timestamptz,
  estimate_minutes integer check (estimate_minutes is null or estimate_minutes >= 0),
  position numeric(20,10) not null default 1000,
  created_by uuid not null references auth.users(id),
  completed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_assignees (
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid not null references auth.users(id),
  assigned_at timestamptz not null default now(),
  primary key (task_id, user_id)
);

create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  body text not null check (char_length(body) between 1 and 10000),
  parent_id uuid references public.task_comments(id) on delete cascade,
  edited_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.task_attachments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  uploaded_by uuid not null references auth.users(id),
  storage_path text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes bigint not null check (size_bytes >= 0 and size_bytes <= 52428800),
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  kind public.notification_kind not null,
  title text not null,
  body text,
  entity_type text,
  entity_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.api_tokens (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  token_prefix text not null,
  token_hash text not null unique,
  scopes text[] not null default '{}',
  created_by uuid not null references auth.users(id),
  last_used_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

-- Index every relationship used by RLS and common product queries.
create index organization_members_user_idx on public.organization_members(user_id, organization_id);
create index teams_organization_idx on public.teams(organization_id);
create index team_members_user_idx on public.team_members(user_id, team_id);
create index projects_organization_idx on public.projects(organization_id);
create index projects_team_idx on public.projects(team_id);
create index project_members_user_idx on public.project_members(user_id, project_id);
create index task_statuses_project_idx on public.task_statuses(project_id, position);
create index tasks_project_status_idx on public.tasks(project_id, status_id, position);
create index tasks_due_idx on public.tasks(due_at) where archived_at is null;
create index tasks_created_by_idx on public.tasks(created_by);
create index task_assignees_user_idx on public.task_assignees(user_id, task_id);
create index task_comments_task_idx on public.task_comments(task_id, created_at);
create index task_attachments_task_idx on public.task_attachments(task_id);
create index notifications_recipient_idx on public.notifications(recipient_id, read_at, created_at desc);
create index activity_logs_org_idx on public.activity_logs(organization_id, created_at desc);
create index api_tokens_org_idx on public.api_tokens(organization_id) where revoked_at is null;

-- Private authorization helpers keep policy evaluation fast and avoid recursive RLS.
create or replace function private.is_org_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from public.organization_members membership
    where membership.organization_id = target_organization_id
      and membership.user_id = (select auth.uid())
  );
$$;

create or replace function private.has_org_role(target_organization_id uuid, allowed_roles public.organization_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from public.organization_members membership
    where membership.organization_id = target_organization_id
      and membership.user_id = (select auth.uid())
      and membership.role = any(allowed_roles)
  );
$$;

create or replace function private.can_access_project(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from public.projects project
    where project.id = target_project_id
      and private.is_org_member(project.organization_id)
      and (
        project.access = 'organization'
        or project.created_by = (select auth.uid())
        or exists (
          select 1 from public.project_members project_member
          where project_member.project_id = project.id
            and project_member.user_id = (select auth.uid())
        )
      )
  );
$$;

create or replace function private.can_edit_project(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from public.projects project
    where project.id = target_project_id
      and (
        private.has_org_role(project.organization_id, array['owner', 'admin']::public.organization_role[])
        or project.created_by = (select auth.uid())
        or exists (
          select 1 from public.project_members project_member
          where project_member.project_id = project.id
            and project_member.user_id = (select auth.uid())
            and project_member.can_edit
        )
      )
  );
$$;

revoke all on function private.is_org_member(uuid) from public, anon;
revoke all on function private.has_org_role(uuid, public.organization_role[]) from public, anon;
revoke all on function private.can_access_project(uuid) from public, anon;
revoke all on function private.can_edit_project(uuid) from public, anon;
grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.has_org_role(uuid, public.organization_role[]) to authenticated;
grant execute on function private.can_access_project(uuid) to authenticated;
grant execute on function private.can_edit_project(uuid) to authenticated;

-- New auth users receive a private profile row.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- Timestamp maintenance.
create or replace function private.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger organizations_updated_at before update on public.organizations for each row execute function private.set_updated_at();
create trigger projects_updated_at before update on public.projects for each row execute function private.set_updated_at();
create trigger tasks_updated_at before update on public.tasks for each row execute function private.set_updated_at();

-- Turn on RLS before granting Data API access.
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.task_statuses enable row level security;
alter table public.tasks enable row level security;
alter table public.task_assignees enable row level security;
alter table public.task_comments enable row level security;
alter table public.task_attachments enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;
alter table public.api_tokens enable row level security;

-- Profiles.
create policy "profiles visible to shared organization members" on public.profiles
for select to authenticated using (
  id = (select auth.uid()) or exists (
    select 1 from public.organization_members mine
    join public.organization_members theirs using (organization_id)
    where mine.user_id = (select auth.uid()) and theirs.user_id = profiles.id
  )
);
create policy "users update own profile" on public.profiles
for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Organizations and memberships.
create policy "members view organizations" on public.organizations
for select to authenticated using ((select private.is_org_member(id)));
create policy "authenticated users create organizations" on public.organizations
for insert to authenticated with check (created_by = (select auth.uid()));
create policy "owners and admins update organizations" on public.organizations
for update to authenticated using ((select private.has_org_role(id, array['owner','admin']::public.organization_role[])))
with check ((select private.has_org_role(id, array['owner','admin']::public.organization_role[])));

create policy "members view organization memberships" on public.organization_members
for select to authenticated using ((select private.is_org_member(organization_id)));
create policy "creators and admins add organization members" on public.organization_members
for insert to authenticated with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.organizations organization
    where organization.id = organization_id and organization.created_by = (select auth.uid())
  )
  or (select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[]))
);
create policy "owners and admins update organization memberships" on public.organization_members
for update to authenticated using ((select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[])))
with check ((select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[])));
create policy "admins remove members or members leave" on public.organization_members
for delete to authenticated using (
  user_id = (select auth.uid())
  or (select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[]))
);

-- Teams.
create policy "members view teams" on public.teams for select to authenticated
using ((select private.is_org_member(organization_id)));
create policy "admins create teams" on public.teams for insert to authenticated
with check (
  created_by = (select auth.uid())
  and (select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[]))
);
create policy "admins manage teams" on public.teams for update to authenticated
using ((select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[])))
with check ((select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[])));
create policy "admins delete teams" on public.teams for delete to authenticated
using ((select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[])));

create policy "members view team memberships" on public.team_members for select to authenticated
using (exists (select 1 from public.teams team where team.id = team_id and private.is_org_member(team.organization_id)));
create policy "admins manage team memberships" on public.team_members for all to authenticated
using (exists (select 1 from public.teams team where team.id = team_id and private.has_org_role(team.organization_id, array['owner','admin']::public.organization_role[])))
with check (exists (select 1 from public.teams team where team.id = team_id and private.has_org_role(team.organization_id, array['owner','admin']::public.organization_role[])));

-- Projects, project membership, and statuses.
create policy "members view permitted projects" on public.projects for select to authenticated
using ((select private.can_access_project(id)));
create policy "members create projects" on public.projects for insert to authenticated
with check (created_by = (select auth.uid()) and (select private.is_org_member(organization_id)));
create policy "editors update projects" on public.projects for update to authenticated
using ((select private.can_edit_project(id))) with check ((select private.can_edit_project(id)));
create policy "admins delete projects" on public.projects for delete to authenticated
using ((select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[])));

create policy "project members visible to project viewers" on public.project_members for select to authenticated
using ((select private.can_access_project(project_id)));
create policy "project editors manage project members" on public.project_members for all to authenticated
using ((select private.can_edit_project(project_id))) with check ((select private.can_edit_project(project_id)));

create policy "view project statuses" on public.task_statuses for select to authenticated
using ((select private.can_access_project(project_id)));
create policy "edit project statuses" on public.task_statuses for all to authenticated
using ((select private.can_edit_project(project_id))) with check ((select private.can_edit_project(project_id)));

-- Tasks and related collaboration.
create policy "view accessible tasks" on public.tasks for select to authenticated
using ((select private.can_access_project(project_id)));
create policy "project members create tasks" on public.tasks for insert to authenticated
with check (created_by = (select auth.uid()) and (select private.can_access_project(project_id)));
create policy "project members update tasks" on public.tasks for update to authenticated
using ((select private.can_access_project(project_id))) with check ((select private.can_access_project(project_id)));
create policy "project editors delete tasks" on public.tasks for delete to authenticated
using ((select private.can_edit_project(project_id)));

create policy "view task assignees" on public.task_assignees for select to authenticated
using (exists (select 1 from public.tasks task where task.id = task_id and private.can_access_project(task.project_id)));
create policy "project members manage assignees" on public.task_assignees for all to authenticated
using (exists (select 1 from public.tasks task where task.id = task_id and private.can_access_project(task.project_id)))
with check (
  assigned_by = (select auth.uid())
  and exists (select 1 from public.tasks task where task.id = task_id and private.can_access_project(task.project_id))
);

create policy "view task comments" on public.task_comments for select to authenticated
using (exists (select 1 from public.tasks task where task.id = task_id and private.can_access_project(task.project_id)));
create policy "project members create comments" on public.task_comments for insert to authenticated
with check (
  author_id = (select auth.uid())
  and exists (select 1 from public.tasks task where task.id = task_id and private.can_access_project(task.project_id))
);
create policy "authors update comments" on public.task_comments for update to authenticated
using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));
create policy "authors or editors delete comments" on public.task_comments for delete to authenticated
using (
  author_id = (select auth.uid())
  or exists (select 1 from public.tasks task where task.id = task_id and private.can_edit_project(task.project_id))
);

create policy "view task attachments" on public.task_attachments for select to authenticated
using (exists (select 1 from public.tasks task where task.id = task_id and private.can_access_project(task.project_id)));
create policy "project members add attachments" on public.task_attachments for insert to authenticated
with check (
  uploaded_by = (select auth.uid())
  and exists (select 1 from public.tasks task where task.id = task_id and private.can_access_project(task.project_id))
);
create policy "uploaders or editors delete attachments" on public.task_attachments for delete to authenticated
using (
  uploaded_by = (select auth.uid())
  or exists (select 1 from public.tasks task where task.id = task_id and private.can_edit_project(task.project_id))
);

-- Notifications, audit records, and API keys.
create policy "users view own notifications" on public.notifications for select to authenticated
using (recipient_id = (select auth.uid()));
create policy "users update own notifications" on public.notifications for update to authenticated
using (recipient_id = (select auth.uid())) with check (recipient_id = (select auth.uid()));

create policy "members view organization activity" on public.activity_logs for select to authenticated
using ((select private.is_org_member(organization_id)));

create policy "admins view api token metadata" on public.api_tokens for select to authenticated
using ((select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[])));
create policy "admins create api tokens" on public.api_tokens for insert to authenticated
with check (
  created_by = (select auth.uid())
  and (select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[]))
);
create policy "admins revoke api tokens" on public.api_tokens for update to authenticated
using ((select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[])))
with check ((select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[])));
create policy "admins delete api tokens" on public.api_tokens for delete to authenticated
using ((select private.has_org_role(organization_id, array['owner','admin']::public.organization_role[])));

-- Explicit Data API grants (required independently of RLS).
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
revoke all on all tables in schema public from anon;

-- Private task-file bucket. Object paths must be organization_id/task_id/filename.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'task-files',
  'task-files',
  false,
  52428800,
  array['image/png','image/jpeg','image/webp','application/pdf','text/plain','text/csv','application/zip']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "members read task files" on storage.objects for select to authenticated
using (
  bucket_id = 'task-files'
  and (select private.is_org_member(((storage.foldername(name))[1])::uuid))
);
create policy "members upload task files" on storage.objects for insert to authenticated
with check (
  bucket_id = 'task-files'
  and owner_id = (select auth.uid()::text)
  and (select private.is_org_member(((storage.foldername(name))[1])::uuid))
);
create policy "owners update task files" on storage.objects for update to authenticated
using (
  bucket_id = 'task-files'
  and owner_id = (select auth.uid()::text)
)
with check (
  bucket_id = 'task-files'
  and owner_id = (select auth.uid()::text)
);
create policy "owners delete task files" on storage.objects for delete to authenticated
using (
  bucket_id = 'task-files'
  and (
    owner_id = (select auth.uid()::text)
    or (select private.has_org_role(((storage.foldername(name))[1])::uuid, array['owner','admin']::public.organization_role[]))
  )
);

-- Realtime collaboration uses RLS-filtered Postgres changes.
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.task_comments;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.activity_logs;
