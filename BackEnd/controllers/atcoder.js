const {
  fetchUserInfo,
  fetchUserContestList
} = require('@qatadaazzeh/atcoder-api');

const cors = require("cors");


exports.atcoder = async (req, res) => {
  const username = req.params.id;

  try {
    // Fetch user data
    const user = await fetchUserInfo(username);
    // Fetch contest history
    const contests = await fetchUserContestList(username);
    // Format contests
    const formattedContests = contests.map(contest => ({
      contestName: contest.contestName,
      contestScreenName: contest.contestScreenName,
      contestUrl: `https://atcoder.jp/contests/${contest.contestScreenName}`,
      rank: contest.userRank,
      performance: contest.userPerformance,
      oldRating: contest.userOldRating,
      newRating: contest.userNewRating,
    }));

    // Return complete structured user info
    return res.json({
      username: user.userName,
      currentRank: user.currentRank, 
      profile: {
        avatar: user.userAvatar  || null,
      },
      userRank: user.userRank,
      userRating: user.userRating,
      userMaxRating: user.userHighestRating,
      userLastCompeted: user.userLastCompetedDate,
      userContestCount: user.userContestCount,
      contests: formattedContests
    });

  } catch (err) {
    console.error("AtCoder API Error:", err);
    return res.status(500).json({ error: "Failed to fetch AtCoder user data" });
  }
};
