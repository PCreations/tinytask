import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';

const betterSqlite = new Database(path.join(process.cwd(), 'tinytask.db'));
export const tinyTaskDb = drizzle(betterSqlite);
