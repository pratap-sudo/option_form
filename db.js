import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

export function getDbPath(customPath) {
  return customPath || process.env.DB_PATH || path.join(process.cwd(), 'data.sqlite');
}

export function initDb(dbPath = getDbPath()) {
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      college TEXT NOT NULL,
      course TEXT NOT NULL,
      position INTEGER NOT NULL
    );
  `);
  return db;
}

export function saveEntries(entries, dbPath = getDbPath()) {
  const db = initDb(dbPath);
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

export function getEntries(dbPath = getDbPath()) {
  const db = initDb(dbPath);
  const rows = db.prepare('SELECT id, college, course, position FROM entries ORDER BY position ASC').all();
  db.close();
  return rows;
}
