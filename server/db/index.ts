import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

if (!process.env.DB_URL) {
  throw new Error('MySQL DB credentials error')
}

const connection = await mysql.createConnection({
  uri: process.env.DB_URL
})

const db = drizzle(connection)

export default db
