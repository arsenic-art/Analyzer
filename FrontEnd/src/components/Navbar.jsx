import React, { useState, useEffect } from "react";
import { User, BarChart3, Trophy, Search, Menu, X, LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isLanding, isLoggedIn, onLogout, showAuth = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMenuOpen(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-lg shadow-2xl border-b border-slate-700/50"
          : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl"
      }`}
    >
      {!isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/15 to-blue-600/10 opacity-50 animate-pulse"></div>
      )}

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "h-14" : "h-16"
          }`}
        >
          <div className="flex items-center space-x-3 group">
            <div
              onClick={() => navigate("/")}
              className={`cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 ${
                isScrolled ? "w-8 h-8" : "w-10 h-10"
              }`}
            >
              <Trophy
                className={`text-white transition-all duration-300 ${
                  isScrolled ? "w-4 h-4" : "w-6 h-6"
                }`}
              />
            </div>
            <div
              onClick={() => navigate("/")}
              className={`cursor-pointer font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent transition-all duration-300 ${
                isScrolled ? "text-2xl" : "text-3xl"
              }`}
            >
              Analyzer
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate("/profiles")}
                className="cursor-pointer group flex items-center space-x-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-slate-800/60 transition-all duration-300 backdrop-blur-sm"
              >
                <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Profiles</span>
                <div className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 group-hover:w-full transition-all duration-300"></div>
              </button>

              <button
                onClick={() => navigate("/compare")}
                className="cursor-pointer group flex items-center space-x-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-slate-800/60 transition-all duration-300 backdrop-blur-sm"
              >
                <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Compare</span>
                <div className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 group-hover:w-full transition-all duration-300"></div>
              </button>

              <button
                onClick={() => navigate("/analytics")}
                className="cursor-pointer group flex items-center space-x-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-slate-800/60 transition-all duration-300 backdrop-blur-sm"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Analytics</span>
                <div className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 group-hover:w-full transition-all duration-300"></div>
              </button>
            </div>

            {/* Auth buttons for desktop - only show on analytics page */}
            {showAuth && (
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className={`cursor-pointer group flex items-center space-x-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-slate-800/60 transition-all duration-300 backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/50 ${
                      isScrolled ? "text-sm" : ""
                    }`}
                  >
                    <LogOut className={`${isScrolled ? "w-3 h-3" : "w-4 h-4"} group-hover:scale-110 transition-transform`} />
                    <span className="font-medium">Logout</span>
                    <div className="w-0 h-0.5 bg-gradient-to-r from-slate-500 to-slate-400 group-hover:w-full transition-all duration-300"></div>
                  </button>
                ) : (
                  <button
                    onClick={handleLogin}
                    className={`cursor-pointer relative group bg-gradient-to-r from-slate-700 to-slate-600 text-white font-semibold rounded-full hover:from-slate-800 hover:to-slate-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-slate-500/50 flex items-center space-x-2 ${
                      isScrolled ? "px-4 py-1.5 text-sm" : "px-5 py-2"
                    }`}
                  >
                    <LogIn className={`${isScrolled ? "w-3 h-3" : "w-4 h-4"}`} />
                    <span className="relative z-10">Login</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                )}
              </div>
            )}

            {/* Get Started button for landing page */}
            {isLanding && (
              <button
                className={`cursor-pointer relative group bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 ${
                  isScrolled ? "px-4 py-1.5 text-sm" : "px-6 py-2"
                }`}
                onClick={() => {navigate('/profiles')}}
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            )}
          </div>

          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="cursor-pointer inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-800/60 transition-all duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50 shadow-2xl transform transition-all duration-300 ease-in-out">
            <div className="px-6 py-4 space-y-3">
              <button
                onClick={() => {
                  navigate("/profiles");
                  setIsMenuOpen(false);
                }}
                className="cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800/60 transition-all duration-300 w-full text-left"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profiles</span>
              </button>

              <button
                onClick={() => {
                  navigate("/compare");
                  setIsMenuOpen(false);
                }}
                className="cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800/60 transition-all duration-300 w-full text-left"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Compare</span>
              </button>

              <button
                onClick={() => {
                  navigate("/analytics");
                  setIsMenuOpen(false);
                }}
                className="cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800/60 transition-all duration-300 w-full text-left"
              >
                <Search className="w-5 h-5" />
                <span className="font-medium">Analytics</span>
              </button>

              {/* Auth buttons for mobile - only show on analytics page */}
              {showAuth && (
                <div className="pt-3 border-t border-slate-700/50 space-y-3">
                  {isLoggedIn ? (
                    <button 
                      onClick={handleLogout}
                      className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800/60 transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  ) : (
                    <button 
                      onClick={handleLogin}
                      className="cursor-pointer w-full flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 text-white font-semibold rounded-lg hover:from-slate-800 hover:to-slate-700 transition-all duration-300 shadow-lg"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </button>
                  )}
                </div>
              )}

              {/* Get Started button for landing page mobile */}
              {isLanding && (
                <div className="pt-3 border-t border-slate-700/50">
                  <button 
                    onClick={() => {navigate('/profiles'); setIsMenuOpen(false);}}
                    className="cursor-pointer w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;