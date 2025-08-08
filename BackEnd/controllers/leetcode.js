const fetch = require("cross-fetch");

const cache = {};
const CACHE_TTL = 5 * 60 * 1000;  

const combinedQuery = `
  query getUserData($username: String!) {
    userContestRankingHistory(username: $username) {
      rating
      ranking
      trendDirection
      problemsSolved
      totalProblems
      finishTimeInSeconds
      contest {
        title
        titleSlug
        startTime
        duration
      }
    }
    userContestRanking(username: $username) {
      rating
      globalRanking
      totalParticipants
      topPercentage
    }
    matchedUser(username: $username) {
      profile {
        ranking
        userAvatar
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    allQuestionsCount {
      difficulty
      count
    }
    recentSubmissionList(username: $username) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
    }
  }
`;

const formatContestHistory = (historyObjects) => {
  return historyObjects
    .filter((contest) => contest.ranking !== null && contest.ranking !== 0)
    .map((contest) => ({
      title: contest.contest.title,
      rating: Math.round(contest.rating ?? 0),
      ranking: contest.ranking,
      trend: contest.trendDirection,
      problemsSolved: contest.problemsSolved,
      totalProblems: contest.totalProblems,
      contestUrl: `https://leetcode.com/contest/${contest.contest.titleSlug}`,
    }));
};

const formatSubmissionStats = (submissionStats) => {
  const formatted = {};
  submissionStats.forEach(({ difficulty, count, submissions }) => {
    formatted[difficulty.toLowerCase()] = { count, submissions };
  });

  return {
    all: formatted.all || { count: 0, submissions: 0 },
    easy: formatted.easy || { count: 0, submissions: 0 },
    medium: formatted.medium || { count: 0, submissions: 0 },
    hard: formatted.hard || { count: 0, submissions: 0 },
  };
};

const formatRecentSubmissions = (submissions) => {
  return submissions.map((sub) => ({
    title: sub.title,
    titleSlug: sub.titleSlug,
    timestamp: sub.timestamp,
    status: sub.statusDisplay,
    language: sub.lang || null,
  }));
};

exports.leetcode = async (req, res) => {
  const user = req.params.id;

  if (cache[user] && Date.now() - cache[user].timestamp < CACHE_TTL) {
    return res.json(cache[user].data);
  }

  try {
    const result = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query: combinedQuery,
        variables: { username: user },
        operationName: "getUserData",
      }),
    });

    const data = await result.json();

    if (data.errors) {
      const msg = data.errors[0]?.message || "GraphQL Error";
      return res.status(400).json({ error: msg });
    }

    const {
      userContestRankingHistory,
      userContestRanking,
      matchedUser,
      allQuestionsCount,
      recentSubmissionList,
    } = data.data;

    const contestHistory = formatContestHistory(userContestRankingHistory || []);

    const currentContestRankingRaw = userContestRanking || {};
    const currentContestRanking = {
      rating: Math.round(currentContestRankingRaw.rating ?? 0),
      globalRanking: currentContestRankingRaw.globalRanking ?? null,
      totalParticipants: currentContestRankingRaw.totalParticipants ?? null,
      topPercentage: Math.round(currentContestRankingRaw.topPercentage ?? 0),
      attendedContests: contestHistory.length,
    };

    const userProfile = matchedUser?.profile || {};
    const acSubmissionNum = matchedUser?.submitStats?.acSubmissionNum || [];
    const totalSubmissionNum = matchedUser?.submitStats?.totalSubmissionNum || [];

    const formattedAcSubmissions = formatSubmissionStats(acSubmissionNum);
    const formattedTotalSubmissions = formatSubmissionStats(totalSubmissionNum);

    const formattedAllQuestionsCount = {};
    (allQuestionsCount || []).forEach(({ difficulty, count }) => {
      formattedAllQuestionsCount[difficulty.toLowerCase()] = count;
    });

    const formattedRecentSubmissions = formatRecentSubmissions(recentSubmissionList || []);

    const responsePayload = {
      username: user,
      profile: {
        ranking: userProfile.ranking || 0,
        avatar: userProfile.userAvatar || null,
      },
      contestRanking: currentContestRanking,
      problemStats: {
        acceptedSubmissions: formattedAcSubmissions,
        totalSubmissions: formattedTotalSubmissions,
      },
      globalProblemCounts: {
        total: formattedAllQuestionsCount.all || 0,
        easy: formattedAllQuestionsCount.easy || 0,
        medium: formattedAllQuestionsCount.medium || 0,
        hard: formattedAllQuestionsCount.hard || 0,
      },
      recentSubmissions: formattedRecentSubmissions,
      contestHistory: contestHistory,
    };

    cache[user] = {
      data: responsePayload,
      timestamp: Date.now(),
    };

    return res.json(responsePayload);
  } catch (err) {
    console.error("Error fetching from LeetCode:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
