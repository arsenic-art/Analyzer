const fetch = require("cross-fetch");
const NodeCache = require("node-cache");
const rateLimit = require("express-rate-limit");
const cache = new NodeCache({ stdTTL: 300 });  

const codeforcesLimiter = rateLimit({
  windowMs: 60 * 1000,  
  max: 30,  
  message: { error: "Too many requests, please try again later." }
});

exports.codeforcesLimiter = codeforcesLimiter;

exports.codeforces = async (req, res) => {
  const handle = req.params.id?.trim();
  if (!handle) {
    return res.status(400).json({ error: "Codeforces handle is required" });
  }
  const cached = cache.get(handle);
  if (cached) return res.json(cached);

  try {
    const fetchJson = async (url, platformName) => {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        throw new Error(`${platformName} API error: ${response.status} ${response.statusText}`);
      }
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`${platformName} API did not return JSON`);
      }
      return await response.json();
    };

    const [userInfoData, ratingData, submissionsData] = await Promise.all([
      fetchJson(`https://codeforces.com/api/user.info?handles=${handle}`, 'Codeforces User Info'),
      fetchJson(`https://codeforces.com/api/user.rating?handle=${handle}`, 'Codeforces Rating History'),
      fetchJson(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10`, 'Codeforces Recent Submissions')
    ]);

    if (userInfoData.status !== "OK") {
      return res.status(404).json({ error: "User not found on Codeforces" });
    }

    const user = userInfoData.result[0];
    const ratingHistory = ratingData.status === "OK" ? ratingData.result : [];
    const recentSubmissions = submissionsData.status === "OK" ? submissionsData.result : [];

    let solvedProblemsCount = 0;
    try {
      const allSubmissionsData = await fetchJson(
        `https://codeforces.com/api/user.status?handle=${handle}`,
        'Codeforces All Submissions'
      );
      if (allSubmissionsData.status === "OK") {
        const solvedSet = new Set();
        for (const sub of allSubmissionsData.result) {
          if (sub.verdict === "OK") {
            solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
          }
        }
        solvedProblemsCount = solvedSet.size;
      }
    } catch (err) {
      console.warn(`Failed to fetch all submissions for ${handle}:`, err.message);
    }

    const responseData = {
      username: user.handle,
      profile: {
        avatar: user.avatar || null,
        rank: user.rank || "unrated",
        maxRank: user.maxRank || "unrated",
        rating: user.rating || null,
        maxRating: user.maxRating || null,
        organization: user.organization || null,
        country: user.country || null,
        city: user.city || null,
        solvedCount: solvedProblemsCount,
      },
      ratingHistory: ratingHistory.map(contest => ({
        contestName: contest.contestName,
        contestId: contest.contestId,
        rank: contest.rank,
        oldRating: contest.oldRating,
        newRating: contest.newRating,
        ratingChange: contest.newRating - contest.oldRating,
        contestUrl: `https://codeforces.com/contest/${contest.contestId}`,
      })),
      recentSubmissions: recentSubmissions.map(sub => ({
        problemName: sub.problem.name,
        contestId: sub.contestId,
        index: sub.problem.index,
        language: sub.programmingLanguage,
        verdict: sub.verdict,
        timeConsumedMs: sub.timeConsumedMillis,
        memoryConsumedBytes: sub.memoryConsumedBytes,
        submissionTime: sub.creationTimeSeconds,
        submissionUrl: `https://codeforces.com/contest/${sub.contestId}/submission/${sub.id}`,
      })),
    };

    cache.set(handle, responseData);
    return res.json(responseData);
  } catch (err) {
    console.error(`Codeforces API Error for ${handle}:`, err.message || err);
    res.status(502).json({ error: "Failed to fetch Codeforces user data" });
  }
};