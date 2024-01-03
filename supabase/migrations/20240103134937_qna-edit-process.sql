CREATE TABLE qna_edit_processes (
    process_id text primary key,
    guild_id text not null,
    question text not null,
    started_at timestamp not null
);

ALTER TABLE qna_edit_processes ENABLE ROW LEVEL SECURITY;
