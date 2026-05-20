import path from 'node:path'
import { defineConfig } from 'prisma/config'
import Database from 'better-sqlite3'
import { PrismaLibSQL } from '@prisma/adapter-better-sqlite3'

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'
const dbPath = dbUrl.replace('file:', '')

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma/schema.prisma'),
  migrate: {
    adapter: () => {
      const client = new Database(dbPath)
      return new PrismaLibSQL(client)
    },
  },
})
