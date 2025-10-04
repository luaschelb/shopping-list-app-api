import { createClient } from "@libsql/client";
require('dotenv').config()

if(!process.env.TURSO_DATABASE_URL  || !process.env.TURSO_AUTH_TOKEN)
{
    throw new Error("Missing enviroment variables TURSO_DATABASE_URL or TURSO_AUTH_TOKEN. Check README for instructions")
}

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});


export default turso