import test from 'node:test';
import assert from 'node:assert/strict';
import { saveEntries, getEntries } from '../db.js';
import fs from 'node:fs';

const testDbPath = './tests/test-data.sqlite';

function cleanup() {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
}

test('saveEntries and getEntries persist entries in sqlite', () => {
  cleanup();

  saveEntries([{ id: '1', college: 'IIT Delhi', course: 'Computer Science' }], testDbPath);
  const entries = getEntries(testDbPath);

  assert.equal(entries.length, 1);
  assert.equal(entries[0].college, 'IIT Delhi');
  assert.equal(entries[0].course, 'Computer Science');

  cleanup();
});
