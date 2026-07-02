import test from 'node:test';
import assert from 'node:assert/strict';

function createStorageMock() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    }
  };
}

test('localStorage-backed persistence keeps saved entries available', () => {
  const storage = createStorageMock();
  const entries = [{ id: '1', college: 'IIT Delhi', course: 'Computer Science' }];
  storage.setItem('option-form-entries', JSON.stringify(entries));
  const loaded = JSON.parse(storage.getItem('option-form-entries'));

  assert.equal(loaded[0].college, 'IIT Delhi');
  assert.equal(loaded[0].course, 'Computer Science');
});
