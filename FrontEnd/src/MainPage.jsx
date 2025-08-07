import { User, BarChart3, Trophy, Search, ChevronRight } from "lucide-react";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Analytics from './components/Analytics';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Dynamic background effects matching navbar theme */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary blue accent - matches navbar gradients */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Subtle accent colors */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-slate-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-400/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        <Navbar isLanding={true} />

        {/* Hero Section */}
        <div className="pt-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center py-20">
            {/* Main heading with blue gradient matching navbar logo */}
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent mb-6 animate-fade-in">
              Welcome to Analyzer
            </h1>
            
            {/* Subtitle with consistent gray text */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Analyze and compare your competitive programming profiles across multiple platforms 
              with our unified analytics dashboard.
            </p>

            {/* CTA Button matching navbar style */}
            <div className="mb-16">
              <button
                onClick={() => navigate('/profiles')}
                className="cursor-pointer group relative inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-8 py-4 rounded-full hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
              >
                <span className="relative z-10">Get Started</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Feature Card 1 - Using glassmorphism like navbar */}
            <div className="group bg-slate-900/40 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/40 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:shadow-blue-500/50 group-hover:shadow-lg transition-all duration-300">
                <User className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 text-center">
                Profile Analysis
              </h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Deep insights into your coding journey with comprehensive analytics across all major platforms
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group bg-slate-900/40 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/40 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:shadow-blue-500/50 group-hover:shadow-lg transition-all duration-300">
                <BarChart3 className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 text-center">
                Compare Profiles
              </h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Side-by-side comparison of multiple programming profiles with detailed performance metrics
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group bg-slate-900/40 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/40 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:shadow-blue-500/50 group-hover:shadow-lg transition-all duration-300">
                <Search className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 text-center">
                Advanced Analytics
              </h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Performance trends, and actionable insights to improve your coding skills
              </p>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="text-center pb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to analyze your coding journey?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Check it out now and take your competitive programming skills to the next level!
            </p>
            <button
              onClick={() => navigate('/Analytics')}
              className="cursor-pointer group relative inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-10 py-4 rounded-full hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
            >
              <span className="relative z-10">Start Analyzing Now</span>
              <Trophy className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;