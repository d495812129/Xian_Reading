-- ============================================
-- 电子书网站数据库 Schema
-- 在 Supabase SQL Editor 中执行此文件
-- ============================================

-- 1. profiles 表：扩展 Supabase 内置的 auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- 新用户注册时自动创建 profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. categories 表：书籍分类
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- 3. books 表：书籍
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  description text,
  cover_url text,
  category_id uuid references public.categories(id) on delete set null,
  pan_link text not null,
  pan_password text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 更新时间自动更新
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists books_updated_at on public.books;
create trigger books_updated_at
  before update on public.books
  for each row execute function public.handle_updated_at();

-- 4. 默认分类（可选，按需修改）
insert into public.categories (name, slug) values
  ('小说', 'novel'),
  ('技术', 'tech'),
  ('历史', 'history'),
  ('哲学', 'philosophy'),
  ('其他', 'other')
on conflict (slug) do nothing;

-- ============================================
-- RLS 行级安全策略
-- ============================================

-- 安全函数：判断用户是否为 admin（security definer 绕过 RLS，避免递归）
create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = user_id), false);
$$;

-- profiles：用户读自己或 admin 读所有
alter table public.profiles enable row level security;

create policy "profiles_select_self"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "profiles_update_self"
  on public.profiles for update
  using (auth.uid() = id);

-- categories：所有人可读
alter table public.categories enable row level security;

create policy "categories_select_all"
  on public.categories for select
  using (true);

create policy "categories_insert_admin"
  on public.categories for insert
  with check (public.is_admin(auth.uid()));

create policy "categories_update_admin"
  on public.categories for update
  using (public.is_admin(auth.uid()));

create policy "categories_delete_admin"
  on public.categories for delete
  using (public.is_admin(auth.uid()));

-- books：所有人可读，只有 admin 可写
alter table public.books enable row level security;

create policy "books_select_all"
  on public.books for select
  using (true);

create policy "books_insert_admin"
  on public.books for insert
  with check (public.is_admin(auth.uid()));

create policy "books_update_admin"
  on public.books for update
  using (public.is_admin(auth.uid()));

create policy "books_delete_admin"
  on public.books for delete
  using (public.is_admin(auth.uid()));

-- ============================================
-- Storage：封面图片存储桶
-- ============================================
-- 在 Supabase Dashboard > Storage 手动创建名为 covers 的 public bucket
-- 或执行以下 SQL（需要 service_role 权限）：
-- insert into storage.buckets (id, name, public) values ('covers', 'covers', true) on conflict do nothing;

-- 封面图存储策略：所有人可读，只有 admin 可写
create policy "covers_read_all"
  on storage.objects for select
  using (bucket_id = 'covers');

create policy "covers_insert_admin"
  on storage.objects for insert
  with check (bucket_id = 'covers' and public.is_admin(auth.uid()));

create policy "covers_update_admin"
  on storage.objects for update
  using (bucket_id = 'covers' and public.is_admin(auth.uid()));

create policy "covers_delete_admin"
  on storage.objects for delete
  using (bucket_id = 'covers' and public.is_admin(auth.uid()));

-- ============================================
-- 提示：如何把自己设为 admin
-- ============================================
-- 注册账号后，在 Supabase SQL Editor 执行：
-- update public.profiles set is_admin = true where id = '你的-user-id';
-- 或通过 email：
-- update public.profiles set is_admin = true
-- where id = (select id from auth.users where email = '你的邮箱');
