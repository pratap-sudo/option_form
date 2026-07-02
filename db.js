import path from 'node:path';
import Database from 'better-sqlite3';
import { Pool } from 'pg';

let postgresPool;

export function getDbPath(customPath) {
  return customPath || process.env.DB_PATH || path.join(process.cwd(), 'data.sqlite');
}

function getPostgresPool() {
  if (postgresPool) {
    return postgresPool;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  postgresPool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
      ? false
      : { rejectUnauthorized: false }
  });

  return postgresPool;
}

async function ensurePostgresTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      college TEXT NOT NULL,
      course TEXT NOT NULL,
      position INTEGER NOT NULL
    );
  `);
}

export async function saveEntries(entries, dbPath = getDbPath()) {
  const pool = getPostgresPool();
  if (pool) {
    await ensurePostgresTable(pool);
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM entries');

      for (const [index, entry] of entries.entries()) {
        await client.query('INSERT INTO entries (id, college, course, position) VALUES ($1, $2, $3, $4)', [
          entry.id || String(index + 1),
          entry.college,
          entry.course,
          index
        ]);
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return entries;
  }

  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      college TEXT NOT NULL,
      course TEXT NOT NULL,
      position INTEGER NOT NULL
    );
  `);
  db.prepare('DELETE FROM entries').run();

  const insert = db.prepare('INSERT INTO entries (id, college, course, position) VALUES (?, ?, ?, ?)');
  const transaction = db.transaction((items) => {
    for (const [index, entry] of items.entries()) {
      insert.run(entry.id || String(index + 1), entry.college, entry.course, index);
    }
  });

  transaction(entries);
  db.close();
  return entries;
}

export async function getEntries(dbPath = getDbPath()) {
  const pool = getPostgresPool();
  if (pool) {
    await ensurePostgresTable(pool);
    const { rows } = await pool.query('SELECT id, college, course, position FROM entries ORDER BY position ASC');
    return rows;
  }

  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      college TEXT NOT NULL,
      course TEXT NOT NULL,
      position INTEGER NOT NULL
    );
  `);
  const rows = db.prepare('SELECT id, college, course, position FROM entries ORDER BY position ASC').all();
  db.close();
  return rows;
}
