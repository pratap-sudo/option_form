import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeEntries } from './entry-utils.js';
import { getEntries, saveEntries } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/entries', (req, res) => {
  res.json(normalizeEntries(getEntries()));
});

app.post('/api/entries', (req, res) => {
  const incoming = Array.isArray(req.body) ? req.body : [];
  const normalized = normalizeEntries(incoming);
  saveEntries(normalized);
  res.json(normalized);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
