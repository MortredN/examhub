import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

if (!process.env.DB_URL) {
  throw new Error('MySQL DB credentials error')
}

const pool = mysql.createPool({
  uri: process.env.DB_URL
})

const db = drizzle(pool)

export default db
