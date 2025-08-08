import React, { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

import Navbar from './Navbar';
import Header from './Header';
import UserInputSection from './UserInputSection';
import SavedProfilesSection from './SavedProfilesSection';
import ComparisonResults from './ComparisonResults';

import { fetchProfile } from '../utils/api';
import { getComparableMetrics, compareMetricValue } from '../utils/metrics';
import { METRIC_CONFIG } from '../utils/constants';

function App() {
  const [user1Usernames, setUser1Usernames] = useState({ leetcode: "", codeforces: "", atcoder: "" });
  const [user2Usernames, setUser2Usernames] = useState({ leetcode: "", codeforces: "", atcoder: "" });
  const [user1Profiles, setUser1Profiles] = useState({});
  const [user2Profiles, setUser2Profiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedProfiles, setSavedProfiles] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("savedComparisons")) || [];
      const validStoredProfiles = stored.filter(item => item && item.user1 && item.user2);
      setSavedProfiles(validStoredProfiles);
    } catch (e) {
      console.error("Failed to parse saved profiles from localStorage", e);
      setSavedProfiles([]);
    }
  }, []);

  const handleSaveUsers = () => {
    const currentComparison = { user1: user1Usernames, user2: user2Usernames };
    const allEmpty = Object.values(user1Usernames).every(u => u.trim() === "") && Object.values(user2Usernames).every(u => u.trim() === "");
    if (allEmpty) {
      setError("Cannot save an empty comparison.");
      return;
    }
    const isDuplicate = savedProfiles.some(p => JSON.stringify(p.user1) === JSON.stringify(currentComparison.user1) && JSON.stringify(p.user2) === JSON.stringify(currentComparison.user2));
    if (isDuplicate) {
      setError("This set of usernames is already saved.");
      return;
    }
    const updated = [...savedProfiles, currentComparison];
    localStorage.setItem("savedComparisons", JSON.stringify(updated));
    setSavedProfiles(updated);
    setError("");
  };

  const handleDeleteProfile = (indexToDelete) => {
    const updatedProfiles = savedProfiles.filter((_, idx) => idx !== indexToDelete);
    localStorage.setItem("savedComparisons", JSON.stringify(updatedProfiles));
    setSavedProfiles(updatedProfiles);
  };

  const handleLoadProfile = (profilePair) => {
    setUser1Usernames(profilePair.user1);
    setUser2Usernames(profilePair.user2);
    setError("");
  };

  const handleFetchComparison = async () => {
    setLoading(true);
    setError("");
    setUser1Profiles({});
    setUser2Profiles({});

    const fetchUserProfiles = async (usernames) => {
      const profiles = {};
      const activeUsernames = Object.entries(usernames).filter(([, username]) => username.trim());
      if (activeUsernames.length === 0) return {};
      
      const results = await Promise.allSettled(
        activeUsernames.map(([platform, username]) =>
          fetchProfile(platform, username.trim()).then(data => ({ platform, data, username: username.trim() }))
        )
      );

      let fetchErrors = [];
      results.forEach((result, index) => {
        const [platformId, usernameValue] = activeUsernames[index];
        if (result.status === "fulfilled") {
          profiles[platformId] = { ...result.value.data, username: usernameValue };
        } else {
          profiles[platformId] = { error: result.reason.message, username: usernameValue };
          fetchErrors.push(result.reason.message);
        }
      });
      if(fetchErrors.length > 0) {
        setError(fetchErrors.join('\n'));
      }
      return profiles;
    };

    try {
      const [profiles1, profiles2] = await Promise.all([
        fetchUserProfiles(user1Usernames),
        fetchUserProfiles(user2Usernames)
      ]);
      setUser1Profiles(profiles1);
      setUser2Profiles(profiles2);

      if (Object.keys(profiles1).length === 0 && Object.keys(profiles2).length === 0) {
        setError("Please enter at least one username to compare.");
      }
    } catch (err) {
      setError("An unexpected error occurred during comparison.");
    } finally {
      setLoading(false);
    }
  };

  const user1Metrics = getComparableMetrics(user1Profiles);
  const user2Metrics = getComparableMetrics(user2Profiles);
  const hasResults = Object.keys(user1Metrics).length > 0 || Object.keys(user2Metrics).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
      <div className="relative z-10 pb-20">
        <Navbar />
        <div className="pt-16">
          <Header />
          <UserInputSection
            user1Usernames={user1Usernames}
            setUser1Usernames={setUser1Usernames}
            user2Usernames={user2Usernames}
            setUser2Usernames={setUser2Usernames}
            onCompare={handleFetchComparison}
            loading={loading}
            error={error}
          />
          <SavedProfilesSection
            savedProfiles={savedProfiles}
            onSave={handleSaveUsers}
            onDelete={handleDeleteProfile}
            onLoad={handleLoadProfile}
          />
          {loading && (
            <div className="text-center py-20">
              <RefreshCcw className="w-12 h-12 animate-spin mx-auto text-blue-400" />
              <p className="mt-4 text-lg">Fetching and comparing profiles...</p>
            </div>
          )}
          {!loading && hasResults && (
            <ComparisonResults
              user1Metrics={user1Metrics}
              user2Metrics={user2Metrics}
              user1Usernames={user1Usernames}
              user2Usernames={user2Usernames}
              compareMetricValue={compareMetricValue}
              METRIC_CONFIG={METRIC_CONFIG}
            />
          )}
          {!loading && !hasResults && !error && (
            <div className="text-center text-slate-400 py-20">
              <p className="text-xl">Enter usernames and click "Compare Profiles" to see the magic!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
