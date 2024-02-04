create table acronyms (
    id serial primary key,
    guild_id text not null,
    acronym text not null,
    acronym_type text not null,
    payload jsonb not null
);

ALTER TABLE acronyms ENABLE ROW LEVEL SECURITY;
