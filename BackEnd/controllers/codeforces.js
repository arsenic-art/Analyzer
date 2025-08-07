const fetch = require("cross-fetch");

exports.codeforces = async (req, res) => {
  const handle = req.params.id;

  try {
    // Helper function to fetch and validate JSON response
    const fetchJson = async (url, platformName) => {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        let errorMessage = `Failed to fetch ${platformName} data from ${url}. Status: ${response.status} ${response.statusText}.`;
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage += ` Error: ${errorData.comment || JSON.stringify(errorData)}`;
        } else {
          const errorText = await response.text();
          errorMessage += ` Response: ${errorText.substring(0, 500)}... (Not JSON)`; // Limit length for logs
        }
        throw new Error(errorMessage);
      }

      if (contentType && contentType.includes('application/json')) { 
        return await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`Invalid response from ${platformName} API (${url}). Expected JSON, got: ${errorText.substring(0, 500)}...`);
      }
    };

    // Fetch user info
    const userInfoData = await fetchJson(`https://codeforces.com/api/user.info?handles=${handle}`, 'Codeforces User Info');
    if (userInfoData.status !== "OK") {
      return res.status(404).json({ error: userInfoData.comment || "User not found on Codeforces" });
    }
    const user = userInfoData.result[0];

    // Fetch user rating history
    const ratingData = await fetchJson(`https://codeforces.com/api/user.rating?handle=${handle}`, 'Codeforces Rating History');
    const ratingHistory = ratingData.status === "OK" ? ratingData.result : [];

    // Fetch recent submissions
    const submissionsData = await fetchJson(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10`, 'Codeforces Recent Submissions');
    const recentSubmissions = submissionsData.status === "OK" ? submissionsData.result : [];

    // Fetch all submissions to calculate solved problems
    // Note: Fetching all submissions can be slow for users with many submissions.
    // Consider pagination or alternative methods if performance is an issue.
    const allSubmissionsData = await fetchJson(`https://codeforces.com/api/user.status?handle=${handle}`, 'Codeforces All Submissions');

    let solvedProblemsCount = 0;
    if (allSubmissionsData.status === "OK") {
      const solvedSet = new Set();
      for (const sub of allSubmissionsData.result) {
        if (sub.verdict === "OK") {
          const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
          solvedSet.add(problemId);
        }
      }
      solvedProblemsCount = solvedSet.size;
    }

    // Format rating history
    const formattedRating = ratingHistory.map((contest) => ({
      contestName: contest.contestName,
      contestId: contest.contestId,
      rank: contest.rank,
      oldRating: contest.oldRating,
      newRating: contest.newRating,
      ratingChange: contest.newRating - contest.oldRating,
      contestUrl: `https://codeforces.com/contest/${contest.contestId}`,
    }));

    // Format recent submissions
    const formattedSubmissions = recentSubmissions.map((sub) => ({
      problemName: sub.problem.name,
      contestId: sub.contestId,
      index: sub.problem.index,
      language: sub.programmingLanguage,
      verdict: sub.verdict,
      timeConsumedMs: sub.timeConsumedMillis,
      memoryConsumedBytes: sub.memoryConsumedBytes,
      submissionTime: sub.creationTimeSeconds,
      submissionUrl: `https://codeforces.com/contest/${sub.contestId}/submission/${sub.id}`,
    }));

    // Send formatted response
    return res.json({
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
      ratingHistory: formattedRating,
      recentSubmissions: formattedSubmissions,
    });
  } catch (err) {
    console.error("Codeforces API Error:", err);
    // Send a more informative error to the frontend
    res.status(500).json({ error: `Codeforces API Error: ${err.message}` });
  }
};