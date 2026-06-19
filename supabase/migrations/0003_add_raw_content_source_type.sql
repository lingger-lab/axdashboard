-- raw_content: 스크래핑된 원문 또는 사용자가 직접 붙여넣은 텍스트
alter table content_pipeline add column raw_content text;

-- source_type: 수동 입력("manual") vs 자동수집("auto") 구분
alter table content_pipeline add column source_type text default 'manual';
