import { Acronym } from "./acronym-types.ts";
import sql from "./db.ts";

export function getAcronyms(guildId: string, acronym: string): Promise<Acronym[]> {
  return sql<Acronym[]>`
        SELECT
            id,
            acronym,
            acronym_type as "acronymType",
            guild_id as "guildId",
            payload
        FROM acronyms
        WHERE guild_id = ${guildId} and acronym = UPPER(${acronym})`;
}
