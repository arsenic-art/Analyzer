import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCcw,
  User,
  Clock,
  Activity,
  Trophy,
  TrendingUp,
  Award,
  Globe,
  Star,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  Trash2,
} from "lucide-react";
import Navbar from "./Navbar";

const PLATFORMS = [
  {
    id: "leetcode",
    name: "LeetCode",
    color: "bg-orange-500",
    textColor: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
  {
    id: "codeforces",
    name: "Codeforces",
    color: "bg-blue-600",
    textColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    id: "atcoder",
    name: "AtCoder",
    color: "bg-cyan-600",
    textColor: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
  },
];

export default function CompetitiveProfiles() {
  const [usernames, setUsernames] = useState({
    leetcode: "",
    codeforces: "",
    atcoder: "",
  });
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (platform, value) => {
    setUsernames((prev) => ({ ...prev, [platform]: value }));
  };

  const fetchProfile = async (platform, username) => {
    try {
      const response = await fetch(
        `https://analyzer-3.onrender.com/${platform}/${username}`
      );
      if (!response.ok) {
        let errorMessage = `Failed to fetch ${platform} profile`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      if (!data || Object.keys(data).length === 0) {
        throw new Error("No data found for this username.");
      }
      return data;
    } catch (err) {
      throw new Error(`Error fetching ${platform}: ${err.message}`);
    }
  };

  const handleFetchProfiles = async () => {
    setLoading(true);
    setError("");
    setProfiles({}); 

    const activeUsernames = Object.entries(usernames).filter(([_, username]) =>
      username.trim()
    );

    if (activeUsernames.length === 0) {
      setError("Please enter at least one username to fetch profiles.");
      setLoading(false);
      return;
    }

    try {
      const results = await Promise.allSettled(
        activeUsernames.map(([platform, username]) =>
          fetchProfile(platform, username.trim()).then((data) => ({
            platform,
            data,
            username: username.trim(), 
          }))
        )
      );

      const newProfiles = {};
      results.forEach((result, index) => {
        const [platformId, usernameValue] = activeUsernames[index];
        if (result.status === "fulfilled") {
          newProfiles[platformId] = {
            ...result.value.data,
            username: usernameValue,
          };
        } else {
          newProfiles[platformId] = {
            error: result.reason.message,
            username: usernameValue,
          };
        }
      });

      setProfiles(newProfiles);
    } catch (err) {
      setError("An unexpected error occurred while fetching profiles.");
    }

    setLoading(false);
  };

  const [savedProfiles, setSavedProfiles] = useState([]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedProfiles")) || [];
    setSavedProfiles(stored);
  }, []);
  const handleSaveUsersButtonClick = () => {
    const allUsernamesEmpty = Object.values(usernames).every(
      (username) => username.trim() === ""
    );

    if (allUsernamesEmpty) {
      setError(
        "All username fields are empty. Please enter at least one username to save."
      );
      return;
    }

    const existing = JSON.parse(localStorage.getItem("savedProfiles")) || [];
    const isDuplicate = existing.some(
      (savedProfile) =>
        savedProfile.leetcode === usernames.leetcode &&
        savedProfile.codeforces === usernames.codeforces &&
        savedProfile.atcoder === usernames.atcoder
    );

    if (isDuplicate) {
      setError("This set of usernames is already saved.");
      return;
    }

    const updated = [...existing, usernames];
    localStorage.setItem("savedProfiles", JSON.stringify(updated));
    setSavedProfiles(updated);
    setError("");
  };

  const handleDeleteProfile = (indexToDelete) => {
    const updatedProfiles = savedProfiles.filter(
      (_, idx) => idx !== indexToDelete
    );
    localStorage.setItem("savedProfiles", JSON.stringify(updatedProfiles));
    setSavedProfiles(updatedProfiles);
  };

  const handleProfileRowClick = (profile) => {
    setUsernames(profile);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-inter">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800">
          <Navbar />
        </div>

        <div className="bg-slate-900/60 backdrop-blur-lg border-b border-slate-700/50 p-8 shadow-xl rounded-b-xl">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl p-4 mt-4 font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent mb-3 flex items-center gap-4">
              CP Profiles
            </h1>
            <p className="ml-6 text-gray-300 text-lg">
              Fetch and compare your coding profiles across platforms
            </p>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-lg border-b border-slate-700/50 p-8 shadow-lg rounded-xl mx-auto max-w-7xl mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-end gap-6">
              {PLATFORMS.map((platform) => (
                <div key={platform.id} className="flex-1 min-w-64">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    {platform.name} Username
                  </label>
                  <input
                    type="text"
                    value={usernames[platform.id]}
                    onChange={(e) =>
                      handleInputChange(platform.id, e.target.value)
                    }
                    placeholder={`Enter ${platform.name} username`}
                    className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300"
                  />
                </div>
              ))}

              <button
                onClick={handleFetchProfiles}
                disabled={loading}
                className="relative group inline-flex items-center space-x-2 px-8 py-3 rounded-full font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow-md transition-all duration-300 hover:scale-105"
              >
                {loading ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                )}
                {loading ? "Fetching..." : "Fetch Profiles"}
              </button>
            </div>

            <div className="mt-8 relative group inline-block">
              <button
                onClick={handleSaveUsersButtonClick}
                className="relative inline-flex items-center space-x-2 px-8 py-3 rounded-full font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-md transition-all duration-300 hover:scale-105"
              >
                <Save className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                Save these Usernames
              </button>

              <div className="absolute bottom-full mb-2 left-3/4 -translate-x-1/2 w-max px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Save for quick access later
              </div>
            </div>

            {error && (
              <div className="mt-6 text-red-300 bg-red-900/30 border border-red-700/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  {error}
                </div>
              </div>
            )}

            {savedProfiles.length > 0 && (
              <div className="mt-10">
                <h3 className="text-white text-lg mb-3">Saved Profiles</h3>
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                  <table className="w-full text-white">
                    <thead className="bg-slate-800 text-slate-300">
                      <tr>
                        <th className="py-3 px-4 text-left">LeetCode</th>
                        <th className="py-3 px-4 text-left">Codeforces</th>
                        <th className="py-3 px-4 text-left">AtCoder</th>
                        <th className="py-3 px-4 text-left">Actions</th>{" "}
                      </tr>
                    </thead>
                    <tbody>
                      {savedProfiles.map((profile, idx) => (
                        <tr
                          key={idx}
                          className="border-t border-slate-700 hover:bg-slate-700/50 transition-all duration-200"
                        >
                          <td
                            className="py-3 px-4 cursor-pointer"
                            onClick={() => handleProfileRowClick(profile)}
                          >
                            {profile.leetcode || "-"}
                          </td>
                          <td
                            className="py-3 px-4 cursor-pointer"
                            onClick={() => handleProfileRowClick(profile)}
                          >
                            {profile.codeforces || "-"}
                          </td>
                          <td
                            className="py-3 px-4 cursor-pointer"
                            onClick={() => handleProfileRowClick(profile)}
                          >
                            {profile.atcoder || "-"}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); 
                                handleDeleteProfile(idx);
                              }}
                              className="p-2 rounded-full bg-red-600/70 hover:bg-red-700 transition-colors duration-200 text-white"
                              title="Delete Profile"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {Object.entries(profiles).map(([platformId, data]) => (
              <ProfileSection
                key={platformId}
                platform={PLATFORMS.find((p) => p.id === platformId)}
                data={data}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ platform, data }) {
  if (data.error) {
    return (
      <div
        className={`${platform.bgColor} ${platform.borderColor} border-2 rounded-2xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl`}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className={`${platform.color} p-4 rounded-2xl shadow-lg`}>
            <User className="w-7 h-7 text-white" />
          </div>
          <h2 className={`text-3xl font-bold ${platform.textColor}`}>
            {platform.name}
          </h2>
        </div>
        <div className="text-red-300 bg-red-900/40 border border-red-700/60 rounded-xl p-6 backdrop-blur-sm">
          <p className="font-semibold text-lg mb-2">
            Failed to load profile for @{data.username}
          </p>
          <p className="text-red-400 opacity-90">{data.error}</p>
        </div>
      </div>
    );
  }

  // Render platform-specific profile component
  return (
    <div
      className={`${platform.bgColor} ${platform.borderColor} border-2 rounded-2xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className={`${platform.color} rounded-2xl p-1 shadow-lg`}>
          <img
            src={
              data.profile?.avatar ||
              `https://placehold.co/64x64/${platform.color.replace(
                "bg-",
                ""
              )}/ffffff?text=${platform.name.substring(0, 1)}`
            }
            alt={`${platform.name} avatar`}
            className="w-16 h-16 rounded-xl object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/64x64/${platform.color.replace(
                "bg-",
                ""
              )}/ffffff?text=${platform.name.substring(0, 1)}`;
            }}
          />
        </div>
        <div>
          <h2 className={`text-3xl font-bold ${platform.textColor} mb-1`}>
            {platform.name}
          </h2>
          {data.username && (
            <p className="text-gray-300 text-xl">@{data.username}</p>
          )}
        </div>
      </div>

      {platform.id === "leetcode" && <LeetCodeProfile data={data} />}
      {platform.id === "codeforces" && <CodeforcesProfile data={data} />}
      {platform.id === "atcoder" && <AtCoderProfile data={data} />}
    </div>
  );
}

function LeetCodeProfile({ data }) {
  const {
    profile,
    contestRanking,
    problemStats,
    recentSubmissions,
    contestHistory,
    globalProblemCounts,
  } = data;
  const totalEasyProblems = globalProblemCounts?.easy || 1;
  const totalMediumProblems = globalProblemCounts?.medium || 1;
  const totalHardProblems = globalProblemCounts?.hard || 1;

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl">
      {" "}
      <div className="max-w-full mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            LeetCode Stats
          </h1>
          <p className="text-slate-400">Overview of coding achievements</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile?.ranking && (
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm border border-orange-500/20 rounded-xl p-6 hover:border-orange-400/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Award className="w-6 h-6 text-orange-400" />
                </div>
                <span className="text-slate-300 font-medium">
                  Global Ranking
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {profile.ranking.toLocaleString()}
              </div>
              <div className="text-sm text-orange-300/80">
                Worldwide position
              </div>
            </div>
          )}

          {contestRanking && (
            <>
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-400/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span className="text-slate-300 font-medium">
                    Contest Rating
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {contestRanking.rating}
                </div>
                <div className="text-sm text-yellow-300/80">
                  Top {contestRanking.topPercentage}%
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-400/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-slate-300 font-medium">Contests</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {contestRanking.attendedContests}
                </div>
                <div className="text-sm text-blue-300/80">Participated</div>
              </div>
            </>
          )}
        </div>

        {/* Problem Breakdown */}
        {problemStats && (
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Problem Statistics
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { level: "easy", total: totalEasyProblems },
                { level: "medium", total: totalMediumProblems },
                { level: "hard", total: totalHardProblems },
              ].map(({ level, total }) => {
                const levelData = problemStats.acceptedSubmissions?.[level];
                const percentage =
                  total > 0
                    ? (((levelData?.count || 0) / total) * 100).toFixed(1)
                    : 0;

                const levelConfig = {
                  easy: {
                    color: "green",
                    bg: "from-green-500/10 to-green-600/5",
                    border: "border-green-500/30",
                  },
                  medium: {
                    color: "yellow",
                    bg: "from-yellow-500/10 to-yellow-600/5",
                    border: "border-yellow-500/30",
                  },
                  hard: {
                    color: "red",
                    bg: "from-red-500/10 to-red-600/5",
                    border: "border-red-500/30",
                  },
                };

                return (
                  <div
                    key={level}
                    className={`bg-gradient-to-br ${levelConfig[level].bg} border ${levelConfig[level].border} rounded-xl p-6`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`font-bold text-lg capitalize text-${levelConfig[level].color}-400`}
                      >
                        {level}
                      </span>
                      <span
                        className={`text-${levelConfig[level].color}-300 text-sm font-medium`}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {levelData?.count || 0}
                      <span className="text-slate-400 text-base font-normal">
                        {" "}
                        / {total}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400 mb-4">
                      {levelData?.submissions || 0} submissions
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r from-${levelConfig[level].color}-400 to-${levelConfig[level].color}-500 transition-all duration-500 ease-out`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Submissions */}
          {recentSubmissions && recentSubmissions.length > 0 && (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Recent Activity
                </h3>
              </div>

              <div className="space-y-4">
                {recentSubmissions.slice(0, 5).map((sub, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white truncate pr-4">
                        <a
                          href={
                            "https://leetcode.com/problems/" +
                            sub.titleSlug +
                            "/description"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 font-medium transition-colors truncate pr-4"
                        >
                          {sub.title}
                        </a>
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          sub.status === "Accepted"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : sub.status === "Wrong Answer"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>{sub.lang || "N/A"}</span>
                      <span>
                        {new Date(
                          Number(sub.timestamp) * 1000
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contest History */}
          {contestHistory && contestHistory.length > 0 && (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Activity className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Recent Contests
                </h3>
              </div>

              <div className="space-y-4">
                {contestHistory.slice(0, 5).map((contest, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <a
                        href={contest.contestUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors truncate pr-4"
                      >
                        {contest.title}
                      </a>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          contest.trend === "UP"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : contest.trend === "DOWN"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                        }`}
                      >
                        {contest.trend}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        Rank:{" "}
                        <span className="text-white font-medium">
                          {contest.ranking}
                        </span>
                      </span>
                      <span className="text-slate-300">
                        Rating:{" "}
                        <span className="text-white font-medium">
                          {contest.rating}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const verdictClass = (verdict) =>
  verdict === "OK"
    ? "bg-green-500/20 text-green-300 border border-green-500/30"
    : verdict?.includes("WRONG") ||
      verdict?.includes("ERROR") ||
      verdict?.includes("FAILED")
    ? "bg-red-500/20 text-red-300 border border-red-500/30"
    : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";

const verdictIcon = (verdict) => {
  if (verdict === "OK") return <CheckCircle className="w-4 h-4" />;
  if (
    verdict?.includes("WRONG") ||
    verdict?.includes("ERROR") ||
    verdict?.includes("FAILED")
  )
    return <XCircle className="w-4 h-4" />;
  return <AlertCircle className="w-4 h-4" />;
};

function ratingDiffCls(diff) {
  if (diff > 0) return "text-green-400";
  if (diff < 0) return "text-red-400";
  return "text-slate-400";
}

function getRankColor(rank) {
  const rankColors = {
    newbie: "from-gray-500 to-gray-600",
    pupil: "from-green-500 to-green-600",
    specialist: "from-cyan-500 to-cyan-600",
    expert: "from-blue-500 to-blue-600",
    "candidate master": "from-purple-500 to-purple-600",
    master: "from-orange-500 to-orange-600",
    "international master": "from-red-500 to-red-600",
    grandmaster: "from-red-600 to-red-700",
    "international grandmaster": "from-red-700 to-red-800",
    "legendary grandmaster": "from-yellow-400 to-red-600",
  };
  return rankColors[rank?.toLowerCase()] || "from-gray-500 to-gray-600";
}

function CodeforcesProfile({ data }) {
  if (!data) return null;
  const handle = data.username || data.handle || "N/A";
  const profile = {
    avatar:
      data.profile?.avatar || "https://userpic.codeforces.org/no-avatar.jpg",
    rank: data.profile?.rank || "unrated",
    maxRank: data.profile?.maxRank || data.profile?.rank || "unrated",
    rating: data.profile?.rating || 0,
    maxRating: data.profile?.maxRating || data.profile?.rating || 0,
    organization: data.profile?.organization || "",
    country: data.profile?.country || "",
    city: data.profile?.city || "",
    solvedCount: data.profile?.solvedCount || 0,
    contribution: data.profile?.contribution || 0,
    friendOfCount: data.profile?.friendOfCount || 0,
  };

  const ratingHistory = data.ratingHistory || [];
  const recentSubmissions = data.recentSubmissions || [];

  const totalContests = ratingHistory.length;
  const positiveChanges = ratingHistory.filter(
    (c) => c.ratingChange > 0
  ).length;
  const winRate =
    totalContests > 0 ? Math.round((positiveChanges / totalContests) * 100) : 0;
  const acceptedSubmissions = recentSubmissions.filter(
    (s) => s.verdict === "OK"
  ).length;
  const submissionAccuracy =
    recentSubmissions.length > 0
      ? Math.round((acceptedSubmissions / recentSubmissions.length) * 100)
      : 0;

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl">
      {" "}
      {/* Adjusted background for nested component */}
      <div className="max-w-full mx-auto space-y-6">
        <div className="text-center mb-8 space-y-4">
          <div className="relative">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2 ">
              Codeforces Stats
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-indigo-400/5 blur-3xl opacity-20"></div>
          </div>
          <p className="text-slate-400 text-lg">
            Competitive Programming Journey Dashboard
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-2xl"></div>

          <div className="relative flex flex-col lg:flex-row gap-8 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt="Codeforces avatar"
                  className="relative rounded-full w-32 h-32 sm:w-40 sm:h-40 border-4 border-blue-400 shadow-2xl bg-white/10 object-cover transform group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left space-y-6 w-full">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
                  @{handle}
                </h2>
                <div className="flex gap-3 justify-center lg:justify-start flex-wrap">
                  <span
                    className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getRankColor(
                      profile.rank
                    )} text-white font-bold capitalize shadow-xl transform hover:scale-105 transition-transform`}
                  >
                    {profile.rank}
                  </span>
                  {profile.maxRank !== profile.rank && (
                    <span
                      className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getRankColor(
                        profile.maxRank
                      )} text-white font-bold capitalize shadow-xl border-2 border-yellow-400/50`}
                    >
                      Peak: {profile.maxRank}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500/15 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 hover:from-blue-500/20 hover:to-blue-600/15 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-slate-300 font-medium">
                      Current Rating
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {profile.rating.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-300">
                    Max: {profile.maxRating.toLocaleString()}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/15 to-green-600/10 border border-green-500/30 rounded-xl p-4 hover:from-green-500/20 hover:to-green-600/15 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-slate-300 font-medium">
                      Problems Solved
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {profile.solvedCount}
                  </div>
                  <div className="text-sm text-green-300">
                    {submissionAccuracy}% Recent Accuracy
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/15 to-purple-600/10 border border-purple-500/30 rounded-xl p-4 hover:from-purple-500/20 hover:to-purple-600/15 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                      <Trophy className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-slate-300 font-medium">Contests</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {totalContests}
                  </div>
                  <div className="text-sm text-purple-300">
                    {winRate}% Positive Rating
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/15 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-4 hover:from-yellow-500/20 hover:to-yellow-600/15 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-slate-300 font-medium">Activity</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {recentSubmissions.length}
                  </div>
                  <div className="text-sm text-yellow-300">
                    Recent Submissions
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 text-slate-300">
                {(profile.city || profile.country) && (
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <div className="p-1.5 bg-slate-700/50 rounded-lg">
                      <Globe className="w-4 h-4 text-slate-400" />
                    </div>
                    <span>
                      {profile.city && `${profile.city}, `}
                      {profile.country}
                    </span>
                  </div>
                )}

                {profile.organization && (
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <div className="p-1.5 bg-slate-700/50 rounded-lg">
                      <Star className="w-4 h-4 text-pink-400" />
                    </div>
                    <span className="truncate max-w-xs">
                      {profile.organization}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Submissions */}
          {recentSubmissions.length > 0 && (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Activity className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Recent Submissions
                </h3>
              </div>

              <div className="space-y-4">
                {recentSubmissions.slice(0, 5).map((sub, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white truncate pr-4">
                        <a
                          href={sub.submissionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 font-medium transition-colors truncate pr-4"
                        >
                          {sub.problemName}
                        </a>
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 ${verdictClass(
                          sub.verdict
                        )}`}
                      >
                        {verdictIcon(sub.verdict)}
                        {sub.verdict}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>
                        {(
                          sub.language ||
                          sub.programmingLanguage ||
                          "N/A"
                        ).replace("C++23 (GCC 14-64, msys2)", "C++23")}
                      </span>
                      <span>
                        {sub.submissionTime
                          ? new Date(
                              sub.submissionTime * 1000
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contest History */}
          {ratingHistory.length > 0 && (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Trophy className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Contest History
                </h3>
              </div>

              <div className="space-y-4">
                {ratingHistory
                  .slice(-5)
                  .reverse()
                  .map((contest, i) => (
                    <div
                      key={i}
                      className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <a
                          href={contest.contestUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 font-medium transition-colors truncate pr-4"
                        >
                          {contest.contestName}
                        </a>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            contest.ratingChange > 0
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : contest.ratingChange < 0
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                          }`}
                        >
                          {contest.ratingChange > 0 ? "+" : ""}
                          {contest.ratingChange}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">
                          Rank:{" "}
                          <span className="text-white font-medium">
                            #{contest.rank?.toLocaleString() || "N/A"}
                          </span>
                        </span>
                        <span className="text-slate-300">
                          Rating:{" "}
                          <span className="text-white font-medium">
                            {contest.newRating || "N/A"}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AtCoderProfile({ data }) {
  if (!data) return null;

  const {
    username,
    profile, 
    currentRank,
    userRank,
    userRating,
    userContestCount,
    contests = [],
  } = data;
  const totalContests = contests.length;
  const bestPerformance =
    totalContests > 0 ? Math.max(...contests.map((c) => c.performance)) : 0;
  const worstPerformance =
    totalContests > 0 ? Math.min(...contests.map((c) => c.performance)) : 0;
  const avgPerformance =
    totalContests > 0
      ? Math.round(
          contests.reduce((sum, c) => sum + c.performance, 0) / totalContests
        )
      : 0;

  const recentContests = contests.slice(-5);
  const ratingTrend =
    recentContests.length >= 2
      ? recentContests[recentContests.length - 1].newRating -
        recentContests[0].oldRating
      : 0;

  // Get rank color based on rating
  const getAtCoderRankColor = (rating) => {
    if (rating >= 2800) return "red"; 
    if (rating >= 2400) return "orange"; 
    if (rating >= 2000) return "yellow"; 
    if (rating >= 1600) return "blue"; 
    if (rating >= 1200) return "cyan";
    if (rating >= 800) return "green"; 
    if (rating >= 400) return "amber"; 
    return "gray";
  };

  const rankColor = getAtCoderRankColor(userRating);

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl">
      {" "}
      <div className="max-w-full mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            AtCoder Stats
          </h1>
          <p className="text-slate-400 mb-2">@{username}</p>
          <div className={`text-xl font-semibold text-${rankColor}-400`}>
            {currentRank}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm border border-orange-500/20 rounded-xl p-6 hover:border-orange-400/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Award className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-slate-300 font-medium">Global Rank</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              #{userRank?.toLocaleString()}
            </div>
            <div className="text-sm text-orange-300/80">Worldwide position</div>
          </div>

          <div
            className={`bg-gradient-to-br from-${rankColor}-500/10 to-${rankColor}-600/5 backdrop-blur-sm border border-${rankColor}-500/20 rounded-xl p-6 hover:border-${rankColor}-400/30 transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 bg-${rankColor}-500/20 rounded-lg`}>
                <TrendingUp className={`w-6 h-6 text-${rankColor}-400`} />
              </div>
              <span className="text-slate-300 font-medium">Current Rating</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {userRating}
            </div>
            <div className={`text-sm text-${rankColor}-300/80`}>
              {currentRank}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-400/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Trophy className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-slate-300 font-medium">Contests</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {userContestCount}
            </div>
            <div className="text-sm text-blue-300/80">Participated</div>
          </div>

          <div
            className={`bg-gradient-to-br ${
              ratingTrend > 0
                ? "from-green-500/10 to-green-600/5"
                : ratingTrend < 0
                ? "from-red-500/10 to-red-600/5"
                : "from-gray-500/10 to-gray-600/5"
            } backdrop-blur-sm border ${
              ratingTrend > 0
                ? "border-green-500/20"
                : ratingTrend < 0
                ? "border-red-500/20"
                : "border-gray-500/20"
            } rounded-xl p-6 hover:${
              ratingTrend > 0
                ? "border-green-400/30"
                : ratingTrend < 0
                ? "border-red-400/30"
                : "border-gray-400/30"
            } transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-2 ${
                  ratingTrend > 0
                    ? "bg-green-500/20"
                    : ratingTrend < 0
                    ? "bg-red-500/20"
                    : "bg-gray-500/20"
                } rounded-lg`}
              >
                <Activity
                  className={`w-6 h-6 ${
                    ratingTrend > 0
                      ? "text-green-400"
                      : ratingTrend < 0
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <span className="text-slate-300 font-medium">Rating Trend</span>
            </div>
            <div className={`text-3xl font-bold text-white mb-1`}>
              {ratingTrend > 0 ? "+" : ""}
              {ratingTrend}
            </div>
            <div
              className={`text-sm ${
                ratingTrend > 0
                  ? "text-green-300/80"
                  : ratingTrend < 0
                  ? "text-red-300/80"
                  : "text-gray-300/80"
              }`}
            >
              Last 5 contests
            </div>
          </div>
        </div>

        {contests.length > 0 && (
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Performance Statistics
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lg text-green-400">
                    Best Performance
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {bestPerformance}
                </div>
                <div className="text-sm text-slate-400 mb-4">
                  Peak contest performance
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min(
                        (bestPerformance / 2000) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lg text-blue-400">
                    Average Performance
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {avgPerformance}
                </div>
                <div className="text-sm text-slate-400 mb-4">
                  Across all contests
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min((avgPerformance / 2000) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30 rounded-xl p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lg text-red-400">
                    Lowest Performance
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {worstPerformance}
                </div>
                <div className="text-sm text-slate-400 mb-4">
                  Room for improvement
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.max(
                        (worstPerformance / 2000) * 100, 
                        10 
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {contests && contests.length > 0 && (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Recent Contests
                </h3>
              </div>

              <div className="space-y-4">
                {contests.slice(0, 5).map((contest, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <a
                        href={
                          contest.contestUrl ||
                          `https://atcoder.jp/contests/${contest.ContestScreenName}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors truncate pr-4"
                        title={contest.ContestName || contest.contestName}
                      >
                        {(
                          contest.ContestName ||
                          contest.contestName ||
                          "Unknown Contest"
                        )
                          .replace(/\(.*?\)/, "")
                          .replace(/Promotion.*$/, "")
                          .replace(/（.*?）/, "")
                          .trim()
                          .substring(0, 35) +
                          ((contest.ContestName || contest.contestName || "")
                            .length > 35
                            ? "..."
                            : "")}
                      </a>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          (contest.NewRating || contest.newRating || 0) >
                          (contest.OldRating || contest.oldRating || 0)
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : (contest.NewRating || contest.newRating || 0) <
                              (contest.OldRating || contest.oldRating || 0)
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                        }`}
                      >
                        {(contest.NewRating || contest.newRating || 0) >
                        (contest.OldRating || contest.oldRating || 0)
                          ? "+"
                          : ""}
                        {(contest.NewRating || contest.newRating || 0) -
                          (contest.OldRating || contest.oldRating || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        Rank:{" "}
                        <span className="text-white font-medium">
                          #
                          {(
                            contest.Place ||
                            contest.rank ||
                            "N/A"
                          )?.toLocaleString?.() ||
                            contest.Place ||
                            contest.rank ||
                            "N/A"}
                        </span>
                      </span>
                      <span className="text-slate-300">
                        Performance:{" "}
                        <span
                          className={`font-medium ${
                            (contest.Performance || contest.performance || 0) >
                            2800
                              ? "text-red-400"
                              : (contest.Performance ||
                                  contest.performance ||
                                  0) > 2400
                              ? "text-orange-400"
                              : (contest.Performance ||
                                  contest.performance ||
                                  0) > 2000
                              ? "text-yellow-400"
                              : (contest.Performance ||
                                  contest.performance ||
                                  0) > 1600
                              ? "text-blue-400"
                              : (contest.Performance ||
                                  contest.performance ||
                                  0) > 1200
                              ? "text-cyan-400"
                              : (contest.Performance ||
                                  contest.performance ||
                                  0) > 800
                              ? "text-green-400"
                              : (contest.Performance ||
                                  contest.performance ||
                                  0) > 400
                              ? "text-amber-600"
                              : "text-gray-400"
                          }`}
                        >
                          {contest.Performance || contest.performance || "N/A"}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Rating Progress</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="text-lg font-semibold text-white">
                    Current Rating
                  </div>
                  <div className={`text-2xl font-bold text-${rankColor}-400`}>
                    {userRating || "Unrated"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Rank</div>
                  <div
                    className={`text-xl font-semibold text-${rankColor}-400`}
                  >
                    {currentRank || "Unranked"}
                  </div>
                </div>
              </div>

              {contests && contests.length > 0 && (
                <div className="space-y-4">
                  <div className="text-sm text-slate-400 mb-2">
                    Recent Rating Changes:
                  </div>
                  {contests.slice(0, 5).map((contest, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3 px-4 bg-slate-700/20 rounded-lg"
                    >
                      <div className="text-sm text-slate-300 truncate pr-4">
                        {(
                          contest.ContestName ||
                          contest.contestName ||
                          "Unknown Contest"
                        )
                          .replace(/\(.*?\)/, "")
                          .replace(/（.*?）/, "")
                          .trim()
                          .substring(0, 25) + "..."}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">
                          {contest.OldRating || contest.oldRating || "N/A"}
                        </span>
                        <span className="text-slate-500">→</span>
                        <span
                          className={`font-semibold ${
                            (contest.NewRating || contest.newRating || 0) >
                            (contest.OldRating || contest.oldRating || 0)
                              ? "text-green-400"
                              : (contest.NewRating || contest.newRating || 0) <
                                (contest.OldRating || contest.oldRating || 0)
                              ? "text-red-400"
                              : "text-gray-300"
                          }`}
                        >
                          {contest.NewRating || contest.newRating || "N/A"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
