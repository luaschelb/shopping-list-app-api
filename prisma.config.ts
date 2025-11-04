import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

// import your .env file
import 'dotenv/config'

if(!process.env.LIBSQL_DATABASE_URL || !process.env.LIBSQL_DATABASE_TOKEN)
{
  throw new Error("Please configure LIBSQL_DATABASE_URL and LIBSQL_DATABASE_TOKEN env variables")
}

export default defineConfig({
  experimental: {
    adapter: true,
  },
  schema: path.join('prisma', 'schema.prisma'),
  async adapter() {
    return new PrismaLibSQL({
      url: process.env.LIBSQL_DATABASE_URL!,
      authToken: process.env.LIBSQL_DATABASE_TOKEN,
    })
  }
})