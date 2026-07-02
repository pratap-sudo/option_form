const STORAGE_KEY = 'option-form-entries';

let entries = [];

export function serializeEntries(items) {
  return JSON.stringify(items);
}

export function parseEntries(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Unable to parse saved entries:', error);
    return [];
  }
}

export function writeEntriesToStorage(storage, items) {
  if (!storage) return;
  storage.setItem(STORAGE_KEY, serializeEntries(items));
}

export function readEntriesFromStorage(storage) {
  if (!storage) return [];
  return parseEntries(storage.getItem(STORAGE_KEY));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function addEntry(items, college, course) {
  const trimmedCollege = college.trim();
  const trimmedCourse = course.trim();

  if (!trimmedCollege || !trimmedCourse) {
    return items;
  }

  return [...items, { id: createId(), college: trimmedCollege, course: trimmedCourse }];
}

export function moveEntry(items, id, direction) {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return items;

  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= items.length) return items;

  const updated = [...items];
  const [movedItem] = updated.splice(index, 1);
  updated.splice(targetIndex, 0, movedItem);
  return updated;
}

export function removeEntry(items, id) {
  return items.filter((item) => item.id !== id);
}

export function createOptionMarkup(items) {
  return items
    .map((item) => `<option value="${item.college} - ${item.course}">${item.college} - ${item.course}</option>`)
    .join('\n');
}

export function createOrderedListMarkup(items) {
  return `<ol>\n${items
    .map((item) => `  <li>${item.college} - ${item.course}</li>`)
    .join('\n')}\n</ol>`;
}

export function createTextFileContent(items) {
  return items.map((item, index) => `${index + 1}. ${item.college} - ${item.course}`).join('\n');
}

function getStorageBackend(storageName) {
  try {
    const storage = globalThis[storageName];
    if (!storage) return null;
    const testKey = '__storage_test__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return storage;
  } catch (error) {
    return null;
  }
}

function readCookieValue() {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(?:^|; )${STORAGE_KEY}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

function writeCookieValue(value) {
  if (typeof document === 'undefined') return;
  document.cookie = `${STORAGE_KEY}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
}

function saveEntries() {
  const payload = serializeEntries(entries);
  writeEntriesToStorage(getStorageBackend('localStorage'), entries);
  writeEntriesToStorage(getStorageBackend('sessionStorage'), entries);
  writeCookieValue(payload);
}

function loadEntries() {
  const storages = [getStorageBackend('localStorage'), getStorageBackend('sessionStorage')];

  for (const storage of storages) {
    const loaded = readEntriesFromStorage(storage);
    if (loaded.length > 0) {
      return loaded;
    }
  }

  return parseEntries(readCookieValue());
}

function render() {
  const list = document.getElementById('entry-list');
  const previewSelect = document.getElementById('preview-select');
  const previewList = document.getElementById('preview-list');
  const htmlOutput = document.getElementById('html-output');

  list.innerHTML = entries
    .map((entry, index) => `
      <li class="entry-item">
        <div class="entry-item__info">
          <strong>${entry.college}</strong>
          <div>${entry.course}</div>
        </div>
        <div class="entry-item__actions">
          <button type="button" class="secondary" data-action="up" data-id="${entry.id}" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" class="secondary" data-action="down" data-id="${entry.id}" ${index === entries.length - 1 ? 'disabled' : ''}>↓</button>
          <button type="button" class="danger" data-action="remove" data-id="${entry.id}">Remove</button>
        </div>
      </li>`)
    .join('');

  previewSelect.innerHTML = createOptionMarkup(entries);
  previewList.innerHTML = entries.length
    ? `<ol>${entries.map((entry) => `<li>${entry.college} - ${entry.course}</li>`).join('')}</ol>`
    : '<p>No entries yet.</p>';
  htmlOutput.textContent = `<select name="college-choice">\n${createOptionMarkup(entries)}\n</select>`;
  saveEntries();
}

function handleListClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;
  if (action === 'up' || action === 'down') {
    entries = moveEntry(entries, id, action);
  }
  if (action === 'remove') {
    entries = removeEntry(entries, id);
  }
  render();
}

function handleFormSubmit(event) {
  event.preventDefault();
  const collegeInput = document.getElementById('college-input');
  const courseInput = document.getElementById('course-input');

  entries = addEntry(entries, collegeInput.value, courseInput.value);
  collegeInput.value = '';
  courseInput.value = '';
  render();
}

function handleSaveFile() {
  const content = createTextFileContent(entries);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'college-course-list.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

if (typeof document !== 'undefined') {
  entries = loadEntries();
  document.getElementById('entry-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('entry-list').addEventListener('click', handleListClick);
  document.getElementById('save-file-btn').addEventListener('click', handleSaveFile);
  render();
}
