import { defineConfig } from 'drizzle-kit'

if (!process.env.DB_URL) {
  throw new Error('MySQL DB credentials error')
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: process.env.DB_URL
  },
  dialect: 'mysql'
})
