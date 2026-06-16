-- lead_diagnoses — 리드 진단 모듈 테이블
create type diagnosis_branch as enum ('A', 'B', 'C');

create table lead_diagnoses (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  name           text,
  q1_career      text not null,
  q2_strength    text not null,
  branch         diagnosis_branch,
  is_regulated   boolean not null default false,
  diagnosis_card text,
  replied        boolean not null default false,
  converted      boolean not null default false,
  reaction_note  text,
  updated_at     timestamptz not null default now()
);

-- updated_at 자동 갱신 트리거
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_lead_diagnoses_updated
  before update on lead_diagnoses
  for each row execute function set_updated_at();

-- 인덱스
create index idx_lead_diagnoses_created on lead_diagnoses(created_at desc);
create index idx_lead_diagnoses_branch on lead_diagnoses(branch);

-- RLS — admin(service_role)만 접근. 일반 anon 접근 차단.
alter table lead_diagnoses enable row level security;
