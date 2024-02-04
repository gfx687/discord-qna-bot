import { z } from "https://deno.land/x/zod@v3.22.4/index.ts";

const envSchema = z.object({
  DB_CONNECTION_STRING: z.string(),
  DISCORD_PUBLIC_KEY: z.string(),
});

export const ENV = envSchema.parse(Deno.env.toObject());
