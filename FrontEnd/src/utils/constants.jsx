export const PLATFORMS = [
  {
    id: "leetcode",
    name: "LeetCode",
    color: "bg-orange-500",
    textColor: "text-orange-400",
  },
  {
    id: "codeforces",
    name: "Codeforces",
    color: "bg-blue-600",
    textColor: "text-blue-400",
  },
  {
    id: "atcoder",
    name: "AtCoder",
    color: "bg-cyan-600",
    textColor: "text-cyan-400",
  },
];

export const SMALLER_BETTER_METRICS = new Set(['leetcodeGlobalRanking', 'atcoderUserRank']);

export const METRIC_CONFIG = {
  leetcode: [
    { key: 'leetcodeGlobalRanking', label: 'Global Rank' },
    { key: 'leetcodeContestRating', label: 'Contest Rating' },
    { key: 'leetcodeSolved', label: 'Total Solved' },
    { key: 'leetcodeEasySolved', label: 'Easy Solved' },
    { key: 'leetcodeMediumSolved', label: 'Medium Solved' },
    { key: 'leetcodeHardSolved', label: 'Hard Solved' },
  ],
  codeforces: [
    { key: 'codeforcesRating', label: 'Current Rating' },
    { key: 'codeforcesMaxRating', label: 'Max Rating' },
    { key: 'codeforcesContests', label: 'Total Contests' },
    { key: 'codeforcesSolved', label: 'Problems Solved' },
    { key: 'codeforcesAvgContestRating', label: 'Avg Contest Rating' },
  ],
  atcoder: [
    { key: 'atcoderUserRank', label: 'Global Rank' },
    { key: 'atcoderRating', label: 'Current Rating' },
    { key: 'atcoderTotalContests', label: 'Total Contests' },
    { key: 'atcoderBestPerformance', label: 'Best Performance' },
    { key: 'atcoderAvgPerformance', label: 'Avg Performance' },
  ],
};
