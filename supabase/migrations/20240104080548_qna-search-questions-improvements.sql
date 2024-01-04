create index qna_tsvector on qna using gin(to_tsvector('english', question));

CREATE OR REPLACE FUNCTION search_questions(search_guild_id text, search_term text)
RETURNS SETOF qna AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM qna
    WHERE
        guild_id = search_guild_id
        AND (
            to_tsvector('english', question) @@ websearch_to_tsquery('english', search_term)
            OR question ILIKE (search_term || '%')
        )
    ORDER BY CASE
      WHEN LOWER(question) = LOWER(search_term) THEN 1
      WHEN question ILIKE (search_term || '%') THEN 2
      ELSE 3
    END
    LIMIT 25;

    -- If no results were found, try Levenshtein search (because there is no index for Levenshtein)
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT *
        FROM qna
        WHERE
            guild_id = search_guild_id
            AND levenshtein(LOWER(question), LOWER(search_term)) <= 3
        LIMIT 25;
    END IF;
END;
$$ LANGUAGE plpgsql;