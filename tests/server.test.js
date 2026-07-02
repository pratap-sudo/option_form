import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEntries } from '../entry-utils.js';

test('normalizeEntries filters invalid rows and preserves the order', () => {
  const normalized = normalizeEntries([
    { id: '1', college: 'IIT Delhi', course: 'Computer Science' },
    { id: '2', college: '  ', course: 'Mechanical' },
    { id: '3', college: 'NIT Trichy', course: 'ECE' }
  ]);

  assert.equal(normalized.length, 2);
  assert.equal(normalized[0].college, 'IIT Delhi');
  assert.equal(normalized[1].college, 'NIT Trichy');
});
