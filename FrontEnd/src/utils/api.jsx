
export const fetchProfile = async (platform, username) => {
  try {
    const response = await fetch(
      `https://analyzer-3.onrender.com/${platform}/${username}`
    );
    if (!response.ok) {
      let errorMessage = `Failed to fetch ${platform} profile for ${username}.`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    if (!data || Object.keys(data).length === 0) {
      throw new Error(`No data found for ${username} on ${platform}.`);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
