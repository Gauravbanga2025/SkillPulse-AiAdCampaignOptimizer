const { defineConfig } = require('@prisma/config')

const dbUrl = process.env.DATABASE_URL || 'file:/app/data/production.db'

module.exports = defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: dbUrl,
  },
})
