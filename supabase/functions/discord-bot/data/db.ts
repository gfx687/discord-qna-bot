import postgres from "https://deno.land/x/postgresjs@v3.4.3/mod.js";
import {ENV} from "../env.ts";

const sql = postgres(ENV.DB_CONNECTION_STRING, {
    prepare: false
});

export default sql;

