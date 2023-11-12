import {
  text,
  varchar,
  int,
  timestamp,
  mysqlTableCreator,
} from 'drizzle-orm/mysql-core'

const mysqlTable = mysqlTableCreator((name) => `onezap_${name}`)

// TODO: remove this table, I don't need this anymore
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  email: varchar('email', { length: 200 }),
  createdAt: timestamp('created_at').defaultNow(),
})

export const links = mysqlTable('links', {
  id: int('id').primaryKey().autoincrement(),
  nanoId: varchar('nid', { length: 12 }).notNull(),
  title: text('title'),
  description: text('description'),
  url: text('url').notNull(),
  favIconUrl: text('fav_icon_url'),
  userId: varchar('user_id', { length: 255 }),
  group: varchar('group', { length: 12 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
})
