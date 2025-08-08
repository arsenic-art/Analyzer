import React from "react";
import { Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

import InputField from "../pages/InputField";
import ActionButton from "../pages/ActionButton";

const SignupPage = ({
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
}) => (
  <div className="w-full max-w-md space-y-8">
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-gray-400 mt-2">Join Analyzer today</p>
      </div>
    </div>

    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.apiError && (
        <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errors.apiError}</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          icon={User}
          name="firstName"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleInputChange}
          error={errors.firstName}
        />
        <InputField
          icon={User}
          name="lastName"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
        />
      </div>

      <InputField
        icon={Mail}
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
      />

      <InputField
        icon={Lock}
        name="password"
        placeholder="Create password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        showToggle={true}
        onToggle={() => setShowPassword(!showPassword)}
        showPassword={showPassword}
      />

      <InputField
        icon={Lock}
        name="confirmPassword"
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        error={errors.confirmPassword}
        showToggle={true}
        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
        showPassword={showConfirmPassword}
      />

      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-4 h-4 mt-1 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 cursor-pointer"
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-400 leading-relaxed cursor-pointer"
          >
            I agree to the{" "}
            <span
              onClick={(e) => {
                setTermsPopupOpen(true);
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors font-semibold underline"
            >
              Terms & Conditions
            </span>
          </label>
        </div>

        {errors.terms && (
          <div className="flex items-center space-x-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.terms}</span>
          </div>
        )}
      </div>

      <ActionButton
        type="submit"
        disabled={!termsAccepted}
        gradient="from-blue-600 to-blue-500"
        shadow="hover:shadow-blue-500/25"
        isLoading={isLoading}
      >
        <span>{isLoading ? "Creating..." : "Create Account"}</span>
        {!isLoading && <ArrowRight className="w-5 h-5" />}
      </ActionButton>
    </form>

    <div className="text-center">
      <p className="text-gray-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setCurrentPage("login")}
          className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  </div>
);

export default SignupPage;
