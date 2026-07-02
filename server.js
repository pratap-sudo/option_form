import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeEntries } from './entry-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

let entries = [];

app.get('/api/entries', (req, res) => {
  res.json(normalizeEntries(entries));
});

app.post('/api/entries', (req, res) => {
  const incoming = Array.isArray(req.body) ? req.body : [];
  entries = normalizeEntries(incoming);
  res.json(entries);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
