import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'node:path';

// Determine database path from environment or default
const dbUrl = process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'production.db')}`

console.log(`[db]: Initializing database at ${dbUrl}`)

// Initialize Prisma with PrismaBetterSqlite3 adapter (Prisma 7)
const adapter = new PrismaBetterSqlite3({ url: dbUrl })

export const prisma = new PrismaClient({ adapter })

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
