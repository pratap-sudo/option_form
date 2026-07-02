import test from 'node:test';
import assert from 'node:assert/strict';
import { createTextFileContent } from '../script.js';

test('createTextFileContent formats entries as a plain text list', () => {
  const content = createTextFileContent([
    { id: '1', college: 'IIT Delhi', course: 'Computer Science' },
    { id: '2', college: 'NIT Trichy', course: 'Mechanical' }
  ]);

  assert.equal(content, '1. IIT Delhi - Computer Science\n2. NIT Trichy - Mechanical');
});
