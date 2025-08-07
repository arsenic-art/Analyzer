import { SMALLER_BETTER_METRICS } from './constants';

export const getComparableMetrics = (profiles) => {
  const metrics = {};
  if (profiles.leetcode && !profiles.leetcode.error) {
    const lc = profiles.leetcode;
    metrics.leetcodeSolved = lc.problemStats?.acceptedSubmissions?.all?.count || 0;
    metrics.leetcodeContestRating = lc.contestRanking?.rating || 0;
    metrics.leetcodeEasySolved = lc.problemStats?.acceptedSubmissions?.easy?.count || 0;
    metrics.leetcodeMediumSolved = lc.problemStats?.acceptedSubmissions?.medium?.count || 0;
    metrics.leetcodeHardSolved = lc.problemStats?.acceptedSubmissions?.hard?.count || 0;
    metrics.leetcodeGlobalRanking = lc.profile?.ranking || 0;
  }
  if (profiles.codeforces && !profiles.codeforces.error) {
    const cf = profiles.codeforces;
    const rh = cf.ratingHistory || [];
    metrics.codeforcesRating = cf.profile?.rating || 0;
    metrics.codeforcesMaxRating = cf.profile?.maxRating || 0;
    metrics.codeforcesSolved = cf.profile?.solvedCount || 0;
    metrics.codeforcesAvgContestRating = rh.length > 0 ? Math.round(rh.reduce((sum, entry) => sum + entry.newRating, 0) / rh.length) : 0;
    metrics.codeforcesContests = rh.length || 0;
  }
  if (profiles.atcoder && !profiles.atcoder.error) {
    const ac = profiles.atcoder;
    const co = ac.contests || [];
    metrics.atcoderRating = ac.userRating || 0;
    metrics.atcoderTotalContests = ac.userContestCount || 0;
    metrics.atcoderAvgPerformance = co.length > 0 ? Math.round(co.reduce((sum, c) => sum + c.performance, 0) / co.length) : 0;
    metrics.atcoderBestPerformance = co.length > 0 ? Math.max(...co.map(c => c.performance)) : 0;
    metrics.atcoderUserRank = ac.userRank || 0;
  }
  return metrics;
};

export const compareMetricValue = (val1, val2, metricKey) => {
  const isSmallerBetter = SMALLER_BETTER_METRICS.has(metricKey);
  const v1 = val1 || 0;
  const v2 = val2 || 0;

  if (isSmallerBetter) {
    if (v1 > 0 && (v2 <= 0 || v1 < v2)) return 'user1';
    if (v2 > 0 && (v1 <= 0 || v2 < v1)) return 'user2';
  } else {
    if (v1 > v2) return 'user1';
    if (v2 > v1) return 'user2';
  }
  return 'tie';
};
