export function normalizeEntries(items) {
  return (Array.isArray(items) ? items : [])
    .map((entry, index) => ({
      id: entry?.id || String(index + 1),
      college: String(entry?.college ?? '').trim(),
      course: String(entry?.course ?? '').trim()
    }))
    .filter((entry) => entry.college && entry.course)
    .map((entry, index) => ({ ...entry, position: index }));
}
