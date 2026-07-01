-- ============================================================
-- Darul Uloom Faizan-E-Ashraf — Full Database Schema (reference copy)
-- This is a saved reference of the schema actually applied in Supabase.
-- ============================================================

create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'superadmin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at before update on profiles for each row execute function set_updated_at();

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create table institutions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_institutions_updated_at before update on institutions for each row execute function set_updated_at();
create index idx_institutions_slug on institutions(slug);

create table news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  image_url text,
  category text not null default 'news' check (category in ('news', 'announcement', 'event')),
  published boolean not null default true,
  published_at timestamptz default now(),
  author_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_news_updated_at before update on news for each row execute function set_updated_at();
create index idx_news_published on news(published, published_at desc);
create index idx_news_category on news(category);
create index idx_news_slug on news(slug);

create table gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_image_url text,
  event_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_gallery_albums_updated_at before update on gallery_albums for each row execute function set_updated_at();

create table gallery_media (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references gallery_albums(id) on delete cascade,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  media_url text not null,
  thumbnail_url text,
  caption text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_gallery_media_album on gallery_media(album_id);

create table staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text not null,
  institution_id uuid references institutions(id) on delete set null,
  bio text,
  photo_url text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_staff_updated_at before update on staff for each row execute function set_updated_at();
create index idx_staff_institution on staff(institution_id);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  title text not null,
  description text,
  image_url text,
  achievement_date date,
  institution_id uuid references institutions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_achievements_updated_at before update on achievements for each row execute function set_updated_at();

create table downloads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  file_size_kb int,
  category text not null default 'general' check (category in ('general', 'circular', 'notice', 'syllabus', 'form')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_downloads_updated_at before update on downloads for each row execute function set_updated_at();
create index idx_downloads_category on downloads(category);

create table admissions (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  phone text not null,
  email text not null,
  institution_id uuid references institutions(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'enrolled', 'rejected')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_admissions_updated_at before update on admissions for each row execute function set_updated_at();
create index idx_admissions_status on admissions(status);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_contact_messages_read on contact_messages(is_read);

create table students (
  id uuid primary key default gen_random_uuid(),
  roll_number text not null,
  admission_number text not null unique,
  full_name text not null,
  institution_id uuid references institutions(id) on delete set null,
  class_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint students_class_roll_unique unique (class_name, roll_number)
);
create trigger trg_students_updated_at before update on students for each row execute function set_updated_at();
create index idx_students_class_roll on students(class_name, roll_number);

create table exam_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  exam_name text not null,
  exam_year int not null,
  subjects jsonb not null default '[]',
  total_marks int,
  obtained_marks int,
  percentage numeric(5,2),
  grade text,
  result_status text not null default 'pass' check (result_status in ('pass', 'fail', 'pending')),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_exam_results_updated_at before update on exam_results for each row execute function set_updated_at();
create index idx_exam_results_student on exam_results(student_id);
create index idx_exam_results_published on exam_results(published);

create view published_results
  with (security_invoker = true)
as
select er.id, s.roll_number, s.admission_number, s.full_name, s.class_name,
  er.exam_name, er.exam_year, er.subjects, er.total_marks, er.obtained_marks,
  er.percentage, er.grade, er.result_status
from exam_results er
join students s on s.id = er.student_id
where er.published = true;

create view available_classes
  with (security_invoker = true)
as
select distinct class_name from students order by class_name;

alter table profiles enable row level security;
alter table institutions enable row level security;
alter table news enable row level security;
alter table gallery_albums enable row level security;
alter table gallery_media enable row level security;
alter table staff enable row level security;
alter table achievements enable row level security;
alter table downloads enable row level security;
alter table admissions enable row level security;
alter table contact_messages enable row level security;
alter table students enable row level security;
alter table exam_results enable row level security;

create or replace function is_admin()
returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid());
$$ language sql security definer stable;

create policy "Public can view institutions" on institutions for select using (true);
create policy "Public can view published news" on news for select using (published = true);
create policy "Public can view gallery albums" on gallery_albums for select using (true);
create policy "Public can view gallery media" on gallery_media for select using (true);
create policy "Public can view active staff" on staff for select using (is_active = true);
create policy "Public can view achievements" on achievements for select using (true);
create policy "Public can view downloads" on downloads for select using (true);
create policy "Public can view published results" on exam_results for select using (published = true);
create policy "Public can view students for result lookup" on students for select using (true);
create policy "Anyone can submit admission inquiry" on admissions for insert with check (true);
create policy "Anyone can submit contact message" on contact_messages for insert with check (true);
create policy "Admins manage institutions" on institutions for all using (is_admin()) with check (is_admin());
create policy "Admins manage news" on news for all using (is_admin()) with check (is_admin());
create policy "Admins manage gallery albums" on gallery_albums for all using (is_admin()) with check (is_admin());
create policy "Admins manage gallery media" on gallery_media for all using (is_admin()) with check (is_admin());
create policy "Admins manage staff" on staff for all using (is_admin()) with check (is_admin());
create policy "Admins manage achievements" on achievements for all using (is_admin()) with check (is_admin());
create policy "Admins manage downloads" on downloads for all using (is_admin()) with check (is_admin());
create policy "Admins manage admissions" on admissions for all using (is_admin()) with check (is_admin());
create policy "Admins manage contact messages" on contact_messages for all using (is_admin()) with check (is_admin());
create policy "Admins manage students" on students for all using (is_admin()) with check (is_admin());
create policy "Admins manage exam results" on exam_results for all using (is_admin()) with check (is_admin());
create policy "Admins view own profile" on profiles for select using (auth.uid() = id);
create policy "Admins update own profile" on profiles for update using (auth.uid() = id);

insert into storage.buckets (id, name, public) values ('images', 'images', true);
insert into storage.buckets (id, name, public) values ('documents', 'documents', true);

create policy "Public can view images" on storage.objects for select using (bucket_id = 'images');
create policy "Public can view documents" on storage.objects for select using (bucket_id = 'documents');
create policy "Admins can upload images" on storage.objects for insert with check (bucket_id = 'images' and is_admin());
create policy "Admins can update images" on storage.objects for update using (bucket_id = 'images' and is_admin());
create policy "Admins can delete images" on storage.objects for delete using (bucket_id = 'images' and is_admin());
create policy "Admins can upload documents" on storage.objects for insert with check (bucket_id = 'documents' and is_admin());
create policy "Admins can update documents" on storage.objects for update using (bucket_id = 'documents' and is_admin());
create policy "Admins can delete documents" on storage.objects for delete using (bucket_id = 'documents' and is_admin());
