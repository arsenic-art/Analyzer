export const fetchProfile = async (platform, username) => {
  console.log(`Fetching ${platform} for ${username}...`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "nonexistent") {
        reject(new Error(`User '${username}' not found on ${platform}.`));
        return;
      }

      const mockData = {
        leetcode: {
          profile: { ranking: Math.floor(Math.random() * 100000) + 1 },
          contestRanking: { rating: Math.floor(Math.random() * 1000) + 1500 },
          problemStats: {
            acceptedSubmissions: {
              all: { count: Math.floor(Math.random() * 800) + 50 },
              easy: { count: Math.floor(Math.random() * 300) },
              medium: { count: Math.floor(Math.random() * 400) },
              hard: { count: Math.floor(Math.random() * 100) },
            },
          },
        },
        codeforces: {
          profile: {
            rating: Math.floor(Math.random() * 1200) + 1200,
            maxRating: Math.floor(Math.random() * 500) + 2400,
            solvedCount: Math.floor(Math.random() * 1000) + 200,
          },
          ratingHistory: Array.from({ length: Math.floor(Math.random() * 50) + 10 }, () => ({
            newRating: Math.floor(Math.random() * 300) + 1400,
          })),
        },
        atcoder: {
          userRating: Math.floor(Math.random() * 1000) + 800,
          userRank: Math.floor(Math.random() * 20000) + 1,
          userContestCount: Math.floor(Math.random() * 100) + 5,
          contests: Array.from({ length: Math.floor(Math.random() * 20) + 5 }, () => ({
            performance: Math.floor(Math.random() * 800) + 1000,
          })),
        },
      };

      resolve(mockData[platform]);
    }, 1000 + Math.random() * 500);  
  });
};
