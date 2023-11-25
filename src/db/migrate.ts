import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'path';
import { tinyTaskDb } from './tinytask-db';

migrate(tinyTaskDb, {
  migrationsFolder: path.join(process.cwd(), '/drizzle/migrations'),
});
