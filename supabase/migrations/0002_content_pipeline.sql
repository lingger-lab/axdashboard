-- content_pipeline — 콘텐츠 파이프라인 상태 관리
create type pipeline_status as enum (
  'candidate', 'selected', 'generated', 'approved', 'published'
);

create type publish_channel as enum (
  'blog', 'newsletter', 'youtube', 'kakao', 'facebook'
);

create table content_pipeline (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  news_source     text not null,
  title           text,
  selected        boolean not null default false,
  brad_comment    text,
  newsletter_body text,
  shortform_script text,
  image_url       text,
  video_url       text,
  status          pipeline_status not null default 'candidate',
  channel         publish_channel,
  scheduled_at    timestamptz,
  published_at    timestamptz,
  updated_at      timestamptz not null default now()
);

create trigger trg_content_pipeline_updated
  before update on content_pipeline
  for each row execute function set_updated_at();

create index idx_content_pipeline_status on content_pipeline(status);
create index idx_content_pipeline_created on content_pipeline(created_at desc);

alter table content_pipeline enable row level security;
