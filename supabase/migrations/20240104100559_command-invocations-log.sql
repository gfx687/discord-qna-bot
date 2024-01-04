create table command_invocations_log (
    guild_id text not null,
    question text not null,
    invoked_at timestamp default now(),
    user_id text not null,
    username text not null,
    user_global_name text not null,
    command text not null
);

ALTER TABLE command_invocations_log ENABLE ROW LEVEL SECURITY;
