import React from 'react';

const Header = () => (
  <div className="bg-slate-900/60 backdrop-blur-lg border-b border-slate-700/50 p-8 shadow-xl rounded-b-xl">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl p-4 mt-4 font-bold bg-gradient-to-r from-blue-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent mb-3 flex items-center gap-4">
        Competitive Profile Comparison
      </h1>
      <p className="text-gray-300 text-lg ml-6">
        Compare two users' coding profiles across platforms.
      </p>
    </div>
  </div>
);

export default Header;
