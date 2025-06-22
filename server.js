import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/lessons', async (_req, res) => {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, summary')
    .order('id');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const { data, error } = await supabase
    .from('users')
    .select('id, username')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error) return res.status(401).json({ error: 'Login mislukt' });
  res.json({ message: 'OK', user: data });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API draait op http://localhost:${PORT}`);
});
