import express from 'express';
import cors from 'cors';
import { normalizeEntries } from './entry-utils.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let entries = [];

app.get('/api/entries', (req, res) => {
  res.json(normalizeEntries(entries));
});

app.post('/api/entries', (req, res) => {
  const incoming = Array.isArray(req.body) ? req.body : [];
  entries = normalizeEntries(incoming);
  res.json(entries);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
