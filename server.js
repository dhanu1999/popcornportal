import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables. It will look for .env or .env.local
dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Proxy endpoint to mask the Watchmode API key
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Notice we use the env variable directly without exposing it to the client
    const API_KEY = process.env.VITE_WATCHMODE_API_KEY || process.env.WATCHMODE_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured on server' });
    }

    const watchmodeUrl = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=${API_KEY}&search_value=${encodeURIComponent(query)}&search_type=1`;
    
    // Node fetch implementation (built-in in newer Node versions or requires node-fetch in older ones)
    // We'll rely on global fetch if Node >= 18 is used.
    const response = await fetch(watchmodeUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Error fetching from Watchmode API:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/api/sources', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Movie ID parameter is required' });
    }

    const API_KEY = process.env.VITE_WATCHMODE_API_KEY || process.env.WATCHMODE_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured on server' });
    }

    const watchmodeUrl = `https://api.watchmode.com/v1/title/${id}/details/?apiKey=${API_KEY}&append_to_response=sources`;
    
    const response = await fetch(watchmodeUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Error fetching sources from Watchmode API:', error);
    return res.status(500).json({ error: 'Failed to fetch tracking data' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server proxy running on http://localhost:${PORT}`);
});
