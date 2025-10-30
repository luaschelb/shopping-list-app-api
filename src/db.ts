import { Client, createClient } from "@libsql/client";
import 'dotenv/config'

var db : Client;

if(process.env.DATABASE_URL  && process.env.AUTH_TOKEN)
{
  db = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.AUTH_TOKEN,
  });
}
else if(process.env.DATABASE_URL)
{
  db = createClient({
    url: "file:../dev.db",
  });
}
else
{
  throw new Error("Database not configured")
}

export default db;