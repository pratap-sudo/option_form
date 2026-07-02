import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeEntries, parseEntries, writeEntriesToStorage, readEntriesFromStorage } from '../script.js';

test('serializeEntries and parseEntries round-trip data safely', () => {
  const items = [{ id: '1', college: 'IIT Delhi', course: 'Computer Science' }];
  assert.deepEqual(parseEntries(serializeEntries(items)), items);
});

test('storage helpers read and write through a storage-like object', () => {
  const store = new Map();
  const storage = {
    setItem(key, value) { store.set(key, String(value)); },
    getItem(key) { return store.has(key) ? store.get(key) : null; },
    removeItem(key) { store.delete(key); }
  };

  writeEntriesToStorage(storage, [{ id: '2', college: 'NIT', course: 'ECE' }]);
  assert.deepEqual(readEntriesFromStorage(storage), [{ id: '2', college: 'NIT', course: 'ECE' }]);
});
