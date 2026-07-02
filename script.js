let entries = [];

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

if (typeof document !== 'undefined') {
  document.getElementById('entry-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('entry-list').addEventListener('click', handleListClick);
  render();
}
