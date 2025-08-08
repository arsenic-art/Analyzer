import React from "react";
import { Shield, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";
import ActionButton from "../pages/ActionButton";

const OtpPage = ({
  formData,
  handleOtpChange,
  handleOtpKeyDown,
  errors,
  handleOtpSubmit,
  isLoading,
  otpTimer,
  canResendOtp,
  resendOtp,
  setCurrentPage,
  otpRefs,
}) => (
  <div className="w-full max-w-md space-y-8">
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
          Verify Your Email
        </h2>
        <p className="text-gray-400 mt-2">We've sent a 6-digit code to</p>
        <p className="text-blue-400 font-semibold">{formData.email}</p>
      </div>
    </div>

    <form onSubmit={handleOtpSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-center space-x-3">
          {formData.otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (otpRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className={`w-12 h-12 text-center text-xl font-bold bg-slate-800/50 border ${
                errors.otp ? "border-red-500" : "border-slate-600"
              } rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm`}
            />
          ))}
        </div>
        {errors.otp && (
          <div className="flex items-center justify-center space-x-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.otp}</span>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-gray-400">
        {otpTimer > 0 ? (
          <span>Resend code in {otpTimer}s</span>
        ) : (
          <button
            type="button"
            onClick={resendOtp}
            disabled={!canResendOtp}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Resend Code
          </button>
        )}
      </div>

      <ActionButton
        type="submit"
        disabled={isLoading}
        gradient="from-green-600 to-green-500"
        shadow="hover:shadow-green-500/25"
      >
        <CheckCircle className="w-5 h-5" />
        <span>Verify Email</span>
      </ActionButton>
    </form>

    <div className="text-center">
      <button
        type="button"
        onClick={() => setCurrentPage("signup")}
        className="text-gray-400 hover:text-white transition-colors flex items-center justify-center space-x-2 mx-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Sign Up</span>
      </button>
    </div>
  </div>
);

export default OtpPage;
