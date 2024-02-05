-- changes to search_questions function:
-- 1) levenshtein distance depends on input length
-- 2) for 3 or less don't do at all

CREATE OR REPLACE FUNCTION search_questions(search_guild_id text, search_term text)
RETURNS SETOF qna AS $$
DECLARE
    levenshtein_distance int;
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

    IF length(search_term) <= 5 THEN
        levenshtein_distance := 1;
    ELSIF length(search_term) <= 10 THEN
        levenshtein_distance := 2;
    ELSE
        levenshtein_distance := 3;
    END IF;

    -- Only try levenshtein if first query returned no results as there is no index for levenshtein
    IF NOT FOUND AND LENGTH(search_term) > 3 THEN
        RETURN QUERY
        SELECT *
        FROM qna
        WHERE
            guild_id = search_guild_id
            AND levenshtein(LOWER(question), LOWER(search_term)) <= levenshtein_distance
        LIMIT 25;
    END IF;
END;
$$ LANGUAGE plpgsql;
