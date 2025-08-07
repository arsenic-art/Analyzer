const fetch = require("cross-fetch");

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
    language: sub.lang,
  }));
};

exports.leetcode = (req, res) => {
  const user = req.params.id;

  fetch("https://leetcode.com/graphql", {
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
  })
    .then((result) => result.json())
    .then((data) => {
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

      // Contest History with rounded ratings
      const contestHistory = formatContestHistory(userContestRankingHistory || []);

      // Current Contest Ranking with rounded rating and topPercentage
      const currentContestRankingRaw = userContestRanking || {};
      const currentContestRanking = {
        rating: Math.round(currentContestRankingRaw.rating ?? 0),
        globalRanking: currentContestRankingRaw.globalRanking ?? null,
        totalParticipants: currentContestRankingRaw.totalParticipants ?? null,
        topPercentage: Math.round(currentContestRankingRaw.topPercentage ?? 0),
        attendedContests: contestHistory.length,
      };

      // User Profile Info
      const userProfile = matchedUser?.profile || {};

      // Submission Stats
      const acSubmissionNum = matchedUser?.submitStats?.acSubmissionNum || [];
      const totalSubmissionNum = matchedUser?.submitStats?.totalSubmissionNum || [];

      const formattedAcSubmissions = formatSubmissionStats(acSubmissionNum);
      const formattedTotalSubmissions = formatSubmissionStats(totalSubmissionNum);

      // All Questions Count (global statistics)
      const formattedAllQuestionsCount = {};
      (allQuestionsCount || []).forEach(({ difficulty, count }) => {
        formattedAllQuestionsCount[difficulty.toLowerCase()] = count;
      });

      // Recent Submissions
      const formattedRecentSubmissions = formatRecentSubmissions(recentSubmissionList || []);

      return res.json({
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
      });
    })
    .catch((err) => {
      console.error("Error fetching from LeetCode:", err);
      res.status(500).json({ error: "Something went wrong" });
    });
};
