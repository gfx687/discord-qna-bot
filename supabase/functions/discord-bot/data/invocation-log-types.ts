import { z } from "https://deno.land/x/zod@v3.22.4/index.ts";

export const invocationLogInsertZod = z.object({
  guildId: z.string(),
  question: z.string(),
  userId: z.string(),
  username: z.string(),
  userGlobalName: z.string(),
  command: z.string(),
});
export type InvocationLogInsert = z.infer<typeof invocationLogInsertZod>;
