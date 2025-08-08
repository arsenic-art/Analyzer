const {
  fetchUserInfo,
  fetchUserContestList
} = require('@qatadaazzeh/atcoder-api');
const NodeCache = require("node-cache");
const rateLimit = require("express-rate-limit");

const cache = new NodeCache({ stdTTL: 300 }); 
const atcoderLimiter = rateLimit({
  windowMs: 60 * 1000,  
  max: 30,  
  message: { error: "Too many requests, please try again later." }
});
exports.atcoderLimiter = atcoderLimiter;

exports.atcoder = async (req, res) => {
  const username = req.params.id?.trim();
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
  const cachedData = cache.get(username);
  if (cachedData) {
    return res.json(cachedData);
  }
  try {
    const [user, contests] = await Promise.all([
      fetchUserInfo(username),
      fetchUserContestList(username)
    ]);

    if (!user || !user.userName) {
      return res.status(404).json({ error: "User not found" });
    }
    const formattedContests = contests.map(contest => ({
      contestName: contest.contestName,
      contestScreenName: contest.contestScreenName,
      contestUrl: `https://atcoder.jp/contests/${contest.contestScreenName}`,
      rank: contest.userRank,
      performance: contest.userPerformance,
      oldRating: contest.userOldRating,
      newRating: contest.userNewRating,
    }));

    const responseData = {
      username: user.userName,
      currentRank: user.currentRank,
      profile: {
        avatar: user.userAvatar || null,
      },
      userRank: user.userRank,
      userRating: user.userRating,
      userMaxRating: user.userHighestRating,
      userLastCompeted: user.userLastCompetedDate,
      userContestCount: user.userContestCount,
      contests: formattedContests
    };
    cache.set(username, responseData);
    return res.json(responseData);
  } catch (err) {
    console.error(`AtCoder API Error for ${username}:`, err.message || err);
    return res.status(502).json({ error: "AtCoder service is unavailable or returned an error" });
  }
};
