export default async function handler(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Movie ID parameter is required' });
    }

    // Grab the API key securely from Vercel's environment variables
    const API_KEY = process.env.WATCHMODE_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const watchmodeUrl = `https://api.watchmode.com/v1/title/${id}/details/?apiKey=${API_KEY}&append_to_response=sources`;
    
    // Fetch data directly from the server-side
    const response = await fetch(watchmodeUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    // Send data securely back to the frontend
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching Watchmode sources API:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
}
