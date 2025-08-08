import { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  MessageCircle,
  BarChart3,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Code2,
  MessageSquare,
} from "lucide-react";

const truncateLongArrays = (data, limit = 10) => {
  if (Array.isArray(data)) {
    const truncated = data.length > limit ? data.slice(0, limit) : data;
    return truncated.map((item) => truncateLongArrays(item, limit));
  } else if (typeof data === "object" && data !== null) {
    const newObj = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newObj[key] = truncateLongArrays(data[key], limit);
      }
    }
    return newObj;
  }
  return data;
};

const Analytics = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMode, setActiveMode] = useState("analytics");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [usernames, setUsernames] = useState({
    atcoder: "",
    leetcode: "",
    codeforces: "",
    geeksforgeeks: "",
  });
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const chatWindowRef = useRef(null);
  const platforms = [
    { id: "atcoder", name: "AtCoder", color: "from-orange-500 to-red-500" },
    {
      id: "leetcode",
      name: "LeetCode",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "codeforces",
      name: "Codeforces",
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "geeksforgeeks",
      name: "GFG",
      color: "from-green-500 to-teal-500",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const sendChat = async (prompt) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      return;
    }

    const res = await fetch("http://localhost:3000/setChats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt, history: chatHistory }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || "Failed to get a response from the AI."
      );
    }

    const data = await res.json();
    return data.reply;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/Analytics");
  };

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleUsernameChange = (platform, value) => {
    setUsernames((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const validateAnalyticsInput = () => {
    if (selectedPlatforms.length === 0) {
      setError("Please select at least one platform");
      return false;
    }

    for (const platform of selectedPlatforms) {
      if (!usernames[platform].trim()) {
        setError(
          `Please enter your ${
            platforms.find((p) => p.id === platform)?.name
          } username`
        );
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleAnalyticsSubmit = async () => {
    if (!isLoggedIn) {
      setError("Please log in to use analytics");
      return;
    }

    if (!validateAnalyticsInput()) return;

    setIsLoading(true);
    setError("");

    try {
      const promises = selectedPlatforms.map((platformId) => {
        const username = usernames[platformId];
        return fetch(`http://localhost:3000/${platformId}/${username}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Failed to fetch data for ${username} on ${platformId}`
              );
            }
            return response.json();
          })
          .then((data) => {
            const truncatedData = truncateLongArrays(data, 10);
            return { platform: platformId, data: truncatedData };
          });
      });

      const results = await Promise.all(promises);
      const profileDataString = results
        .map(
          (result) =>
            `Platform: ${result.platform}\nData: ${JSON.stringify(
              result.data,
              null,
              2
            )}`
        )
        .join("\n\n---\n\n");

      const prompt = `Analyze my competitive programming performance based on the following summarized data. Provide insights about my coding skills, problem-solving patterns, strengths, and areas for improvement. Give short responses. For GFG, "maxStreak" is the global maximum streak, while my actual maximum streak is named "currentStreak". At last, give a short summary. Format your response using Markdown with headings, lists, and **bold text** for clarity.

${profileDataString}`;

      const aiResponse = await sendChat(prompt);
      const userDisplayMessage = `Analytics request for: ${selectedPlatforms
        .map((p) => usernames[p])
        .join(", ")}`;

      setChatHistory((prev) => [
        ...prev,
        { type: "user", content: userDisplayMessage },
        { type: "bot", content: aiResponse },
      ]);

      setSelectedPlatforms([]);
      setUsernames({
        atcoder: "",
        leetcode: "",
        codeforces: "",
        geeksforgeeks: "",
      });
    } catch (err) {
      console.error("Analytics submission error:", err);
      setError(err.message || "Failed to get analytics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!isLoggedIn) {
      setError("Please log in to chat");
      return;
    }

    if (!chatMessage.trim()) {
      setError("Please enter a message");
      return;
    }

    const userMessage = chatMessage.trim();
    setChatMessage("");
    setIsLoading(true);
    setError("");

    setChatHistory((prev) => [...prev, { type: "user", content: userMessage }]);

    try {
      const aiResponse = await sendChat(userMessage);
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { type: "user", content: userMessage },
        { type: "bot", content: aiResponse },
      ]);
    } catch (err) {
      console.error("Chat submission error:", err);
      setError(err.message || "Failed to send message. Please try again.");
      setChatHistory((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (activeMode === "chat") {
        handleChatSubmit();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar
        isLanding={false}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        showAuth={true}
      />

      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              AI Analytics Hub
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Get AI-powered insights on your coding journey or just have a
              casual chat.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-slate-800/60 backdrop-blur-lg rounded-full p-1.5 border border-slate-700/50 flex space-x-2">
              <button
                onClick={() => setActiveMode("analytics")}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeMode === "analytics"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setActiveMode("chat")}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeMode === "chat"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
              {activeMode === "analytics" ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Platform Analytics
                    </h2>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Select Platforms
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {platforms.map((platform) => (
                        <button
                          key={platform.id}
                          onClick={() => handlePlatformToggle(platform.id)}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 font-medium text-xs sm:text-sm ${
                            selectedPlatforms.includes(platform.id)
                              ? `bg-gradient-to-r ${platform.color} border-transparent text-white shadow-lg`
                              : "border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/30"
                          }`}
                        >
                          {selectedPlatforms.includes(platform.id) && (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span>{platform.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedPlatforms.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Enter Usernames
                      </label>
                      <div className="space-y-4">
                        {selectedPlatforms.map((platformId) => (
                          <input
                            key={platformId}
                            type="text"
                            value={usernames[platformId]}
                            onChange={(e) =>
                              handleUsernameChange(platformId, e.target.value)
                            }
                            placeholder={`Your ${
                              platforms.find((p) => p.id === platformId).name
                            } username`}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleAnalyticsSubmit}
                    disabled={isLoading || !isLoggedIn}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-5 h-5" />
                        <span>Get Analytics</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">AI Chat</h2>
                  </div>
                  <textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about programming..."
                    className="w-full h-36 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                  />
                  <button
                    onClick={handleChatSubmit}
                    disabled={isLoading || !isLoggedIn}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2 shadow-lg hover:shadow-purple-500/50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              )}
              {error && (
                <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center space-x-2 text-red-300 text-sm">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
              {!isLoggedIn && (
                <div className="mt-4 p-3 bg-blue-900/50 border border-blue-500/50 rounded-lg text-center text-blue-300 text-sm">
                  Please log in to use AI features.
                </div>
              )}
            </div>

            <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-700/50 shadow-2xl h-[80vh] flex flex-col">
              <div className="p-4 border-b border-slate-700 flex-shrink-0">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Conversation</span>
                </h3>
              </div>
              <div
                ref={chatWindowRef}
                className="flex-grow overflow-y-auto p-4 space-y-6"
              >
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-full text-slate-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Your conversation will appear here.</p>
                  </div>
                ) : (
                  chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.type === "bot" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0 self-start"></div>
                      )}
                      <div
                        className={`max-w-[85%] p-3 rounded-xl ${
                          message.type === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-slate-700 text-slate-200 rounded-bl-none"
                        }`}
                      >
                        <ReactMarkdown
                          components={{
                            h1: ({ node, ...props }) => (
                              <h1
                                className="text-xl font-bold my-3"
                                {...props}
                              />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2
                                className="text-lg font-semibold my-2"
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                className="text-md font-semibold my-2"
                                {...props}
                              />
                            ),
                            p: ({ node, ...props }) => (
                              <p className="my-2" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul
                                className="list-disc list-inside my-2"
                                {...props}
                              />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                className="list-decimal list-inside my-2"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="my-1" {...props} />
                            ),
                            code: ({ node, inline, ...props }) =>
                              inline ? (
                                <code
                                  className="bg-slate-800 px-1 py-0.5 rounded text-sm"
                                  {...props}
                                />
                              ) : (
                                <pre className="bg-slate-800 p-2 rounded my-2 overflow-x-auto">
                                  <code {...props} />
                                </pre>
                              ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))
                )}
                {isLoading &&
                  chatHistory.length > 0 &&
                  chatHistory[chatHistory.length - 1].type === "user" && (
                    <div className="flex items-start gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0 self-start"></div>
                      <div className="bg-slate-700 p-3 rounded-xl rounded-bl-none">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Good things take time...</span>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
