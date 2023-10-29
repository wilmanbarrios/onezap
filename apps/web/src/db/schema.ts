import {
  text,
  varchar,
  int,
  timestamp,
  mysqlTableCreator,
} from 'drizzle-orm/mysql-core'

const mysqlTable = mysqlTableCreator((name) => `onezap_${name}`)

export const user = mysqlTable('user', {
  id: int('id').primaryKey().autoincrement(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  email: varchar('email', { length: 200 }),
  createdAt: timestamp('created_at').defaultNow(),
})

export const post = mysqlTable('links', {
  id: int('id').primaryKey().autoincrement(),
  nanoId: varchar('nid', { length: 12 }),
  title: text('title'),
  url: int('url'),
  favIconUrl: text('fav_icon_url'),
  userId: int('user_id'),
  group: varchar('group', { length: 12 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
})
