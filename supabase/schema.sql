-- TOGA Pedia Desa database schema
-- Jalankan file ini di Supabase SQL Editor atau sebagai migration awal.

create extension if not exists pgcrypto;

create table if not exists public.kategori (
  id uuid primary key default gen_random_uuid(),
  nama_kategori varchar(100) not null,
  deskripsi text,
  created_at timestamptz not null default now()
);

create table if not exists public.tanaman_toga (
  id uuid primary key default gen_random_uuid(),
  nama_lokal varchar(255) not null,
  nama_latin varchar(255),
  kategori_id uuid references public.kategori(id) on delete set null,
  deskripsi text not null,
  khasiat_medis text,
  takaran_konsumsi text,
  panduan_tanam text,
  panduan_olah text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE OR REPLACE FUNCTION update_modified_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

CREATE TRIGGER update_tanaman_toga_modtime
BEFORE UPDATE ON public.tanaman_toga
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
