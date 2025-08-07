const axios = require('axios');

exports.gfg = async (req, res) => {
  const username = req.params.id;
  const url = `https://geeks-for-geeks-api.vercel.app/${username}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(`[GFG API] Fetched data for user ${username}:`, data);
    if ('maxStreak' in data) {
      delete data.maxStreak;
    }

    res.json(data);
  } catch (error) {
    console.error(`[GFG API Error] for user ${username}:`, error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        error: `Failed to fetch GeeksforGeeks profile. API responded with status ${error.response.status}.` 
      });
    }
    
    res.status(500).json({ error: 'Failed to fetch GeeksforGeeks profile data due to a server error.' });
  }
};
