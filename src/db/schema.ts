import { text, sqliteTable, integer } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey().notNull(),
  text: text('text').notNull(),
  citation: text('citation').default(''),
  priority: integer('priority').default(0),
});

export type Task = typeof tasks.$inferSelect;
