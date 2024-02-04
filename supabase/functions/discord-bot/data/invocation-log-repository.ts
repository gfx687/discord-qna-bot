import sql from "./db.ts";
import { InvocationLogInsert } from "./invocation-log-types.ts";

export function saveInvocationLog(
  { command, guildId, question, userGlobalName, userId, username }: InvocationLogInsert,
): Promise<void> {
  return sql`
            insert into command_invocations_log (guild_id, question, user_id, username, user_global_name, command)
            values (${guildId}, ${question}, ${userId}, ${username}, ${userGlobalName}, ${command})`;
}
