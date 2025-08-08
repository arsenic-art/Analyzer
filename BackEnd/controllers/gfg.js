const axios = require('axios');
const cache = new Map();

exports.gfg = async (req, res) => {
  const username = req.params.id;
  if (!username || /[^a-zA-Z0-9_-]/.test(username)) {
    return res.status(400).json({ error: 'Invalid username format' });
  }

  const cached = cache.get(username);
  const now = Date.now();
  if (cached && cached.expiry > now) {
    return res.json(cached.data);
  }

  const baseUrl = 'https://geeks-for-geeks-api.vercel.app';
  const url = `${baseUrl}/${username}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const { maxStreak, ...filteredData } = data;

    const cacheDuration = 300 * 1000;  
    cache.set(username, { data: filteredData, expiry: now + cacheDuration });

    res.set('Cache-Control', 'public, max-age=300');
    res.json(filteredData);

  } catch (error) {
    console.error(`GFG API Error for ${username}:`, error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        error: `Failed to fetch GeeksforGeeks profile. API responded with status ${error.response.status}.`
      });
    }

    res.status(500).json({ error: 'Failed to fetch GeeksforGeeks profile data due to a server error.' });
  }
};
