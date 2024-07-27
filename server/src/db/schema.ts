import { mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core'
import crypto from 'crypto'

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(crypto.randomUUID),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 60 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull()
})
