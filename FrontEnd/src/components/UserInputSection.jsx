import React from 'react';
import { User, Search, RefreshCcw, AlertCircle } from 'lucide-react';
import { PLATFORMS } from '../utils/constants';

const UserInputSection = ({ user1Usernames, setUser1Usernames, user2Usernames, setUser2Usernames, onCompare, loading, error }) => (
  <div className="bg-slate-900/40 backdrop-blur-lg border-b border-slate-700/50 p-8 shadow-lg rounded-xl mx-auto max-w-7xl mt-8">
    <div className="max-w-7xl mx-auto space-y-8">
      {/* User 1 Inputs */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-400" /> User 1
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLATFORMS.map((platform) => (
            <div key={`user1-${platform.id}`}>
              <label className="block text-sm font-semibold text-gray-300 mb-2">{platform.name} Username</label>
              <input
                type="text"
                value={user1Usernames[platform.id]}
                onChange={(e) => setUser1Usernames((prev) => ({ ...prev, [platform.id]: e.target.value }))}
                placeholder={`Enter ${platform.name} username`}
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* User 2 Inputs */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-purple-400" /> User 2
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLATFORMS.map((platform) => (
            <div key={`user2-${platform.id}`}>
              <label className="block text-sm font-semibold text-gray-300 mb-2">{platform.name} Username</label>
              <input
                type="text"
                value={user2Usernames[platform.id]}
                onChange={(e) => setUser2Usernames((prev) => ({ ...prev, [platform.id]: e.target.value }))}
                placeholder={`Enter ${platform.name} username`}
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/70 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={onCompare}
          disabled={loading}
          className="relative group inline-flex items-center space-x-2 px-8 py-3 rounded-full font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow-md transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />}
          <span>{loading ? "Comparing..." : "Compare Profiles"}</span>
        </button>
      </div>

      {error && (
        <div className="mt-6 text-red-300 bg-red-900/30 border border-red-700/50 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default UserInputSection;
