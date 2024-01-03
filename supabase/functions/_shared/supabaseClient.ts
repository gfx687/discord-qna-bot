import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.1";
import { Database } from "./database.types.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
if (SUPABASE_URL == undefined) {
  throw new Error("Environment variable SUPABASE_URL is not provided!");
}
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
if (SUPABASE_SERVICE_ROLE_KEY == undefined) {
  throw new Error("Environment variable SUPABASE_SERVICE_ROLE_KEY is not provided!");
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
);
