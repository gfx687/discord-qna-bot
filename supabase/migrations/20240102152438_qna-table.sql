CREATE TABLE qna (
    guild_id text not null,
    question text not null,
    answer text not null,
    primary key (guild_id, question)
);

ALTER TABLE qna ENABLE ROW LEVEL SECURITY;

create extension if not exists "fuzzystrmatch" with schema "public";

CREATE OR REPLACE FUNCTION search_questions(search_guild_id text, search_term text)
RETURNS SETOF qna AS $$
BEGIN
    RETURN QUERY 
    SELECT *
    FROM qna
    WHERE 
        search_guild_id = guild_id
        AND (
          LOWER(question) = LOWER(search_term) 
          OR question ILIKE (search_term || '%')
        )
    ORDER BY CASE
      WHEN LOWER(question) = LOWER(search_term) THEN 1
      WHEN question ILIKE (search_term || '%') THEN 2
      ELSE 3
    END;

    -- If no results were found, try Levenshtein search (because there is no index for Levenshtein)
    IF NOT FOUND THEN
        RETURN QUERY 
        SELECT *
        FROM qna
        WHERE levenshtein(LOWER(question), LOWER(search_term)) <= 3;
    END IF;
END;
$$ LANGUAGE plpgsql;