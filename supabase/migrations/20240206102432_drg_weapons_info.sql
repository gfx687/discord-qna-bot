create table drg_weapons_info (
    name text primary key,
    class text not null,
    search_terms text[],
    mods jsonb not null
);

ALTER TABLE drg_weapons_info ENABLE ROW LEVEL SECURITY;
