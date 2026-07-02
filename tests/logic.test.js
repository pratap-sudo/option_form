import test from 'node:test';
import assert from 'node:assert/strict';
import { addEntry, moveEntry, removeEntry, createOptionMarkup } from '../script.js';

test('addEntry adds college and course in a new item', () => {
  const items = addEntry([], 'IIT Delhi', 'Computer Science');
  assert.equal(items.length, 1);
  assert.equal(items[0].college, 'IIT Delhi');
  assert.equal(items[0].course, 'Computer Science');
});

test('moveEntry changes the order of items', () => {
  const items = [
    { id: '1', college: 'A', course: 'X' },
    { id: '2', college: 'B', course: 'Y' },
    { id: '3', college: 'C', course: 'Z' }
  ];

  const reordered = moveEntry(items, '2', 'up');
  assert.deepEqual(reordered.map((item) => item.college), ['B', 'A', 'C']);
});

test('removeEntry deletes the selected item', () => {
  const items = [
    { id: '1', college: 'A', course: 'X' },
    { id: '2', college: 'B', course: 'Y' }
  ];

  const remaining = removeEntry(items, '1');
  assert.deepEqual(remaining.map((item) => item.college), ['B']);
});

test('createOptionMarkup keeps the chosen order', () => {
  const markup = createOptionMarkup([
    { id: '1', college: 'IIT Delhi', course: 'Computer Science' },
    { id: '2', college: 'NIT Trichy', course: 'Mechanical' }
  ]);

  assert.match(markup, /IIT Delhi - Computer Science/);
  assert.match(markup, /NIT Trichy - Mechanical/);
});
