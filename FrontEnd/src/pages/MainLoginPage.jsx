import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, LogOut } from "lucide-react";

import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import TermsPopup from "./TermsPage";
import Analytics from "./../components/Analytics";
import { useNavigate } from "react-router-dom";


const SuccessPage = ({ onLogout }) => (
  <div className="text-center space-y-6">
    <div className="flex justify-center">
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 shadow-lg">
        <PartyPopper className="w-10 h-10 text-white" />
      </div>
    </div>
    <div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
        Success!
      </h2>
      <p className="text-gray-400 mt-2">You are now logged in.</p>
    </div>
    <button
      onClick={onLogout}
      className="w-full flex items-center justify-center space-x-2 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white font-medium py-3 rounded-xl border border-slate-600/30 transition-all duration-200"
    >
      <LogOut className="w-5 h-5" />
      <span>Logout</span>
    </button>
  </div>
);

const App = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [isTermsPopupOpen, setTermsPopupOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (authToken) {
      // If a token exists, navigate to the main app and show success.
      // This handles the case where a user is already logged in.
      navigate("/Analytics");
      setCurrentPage("success");
    }
  }, [authToken, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.apiError) setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (currentPage === "signup") {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
      if (!termsAccepted)
        newErrors.terms = "You must accept the terms and conditions.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const url =
      currentPage === "signup"
        ? `${API}/register`
        : `${API}/login`;

    const body =
      currentPage === "signup"
        ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({
          apiError: result.message || "An unexpected error occurred.",
        });
        setIsLoading(false);
        return;
      }

      if (result.token) {
        localStorage.setItem("token", result.token);
        setAuthToken(result.token);
      }
    } catch (error) {
      setErrors({
        apiError: "Could not connect to the server. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setCurrentPage("login");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    });
    navigate("/");
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setTermsPopupOpen(false);
  };

  const handleCloseTermsPopup = () => {
    setTermsPopupOpen(false);
  };

  const pages = {
    login: (
      <LoginPage
        {...{
          formData,
          handleInputChange,
          errors,
          handleSubmit,
          isLoading,
          setCurrentPage,
          showPassword,
          setShowPassword,
        }}
      />
    ),
    signup: (
      <SignupPage
        {...{
          formData,
          handleInputChange,
          errors,
          handleSubmit,
          isLoading,
          setCurrentPage,
          showPassword,
          setShowPassword,
          showConfirmPassword,
          setShowConfirmPassword,
          termsAccepted,
          setTermsAccepted,
          setTermsPopupOpen,
        }}
      />
    ),
    success: <SuccessPage onLogout={handleLogout} />,
  };

  const pageVariants = {
    initial: { opacity: 0, x: "-50px" },
    in: { opacity: 1, x: "0px" },
    out: { opacity: 0, x: "50px" },
  };

  const pageTransition = { type: "tween", ease: "anticipate", duration: 0.5 };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
              className="p-8"
            >
              {pages[currentPage]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isTermsPopupOpen && (
          <TermsPopup
            onAccept={handleAcceptTerms}
            onClose={handleCloseTermsPopup}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
