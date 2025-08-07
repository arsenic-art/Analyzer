import { Mail, Lock, ArrowRight, Trophy, AlertCircle  } from "lucide-react";
import InputField from "../pages/InputField";
import ActionButton from "../pages/ActionButton";

const LoginPage = ({
  formData,
  handleInputChange,
  errors,
  handleSubmit,
  isLoading,
  setCurrentPage,
  showPassword,
  setShowPassword,
}) => (
  <div className="w-full max-w-md space-y-8">
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-lg">
          <Trophy className="w-8 h-8 text-white" />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-gray-400 mt-2">Sign in to continue to Analyzer</p>
      </div>
    </div>

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* This block will display the API error message */}
      {errors.apiError && (
        <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errors.apiError}</span>
        </div>
      )}
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
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        showToggle={true}
        onToggle={() => setShowPassword(!showPassword)}
        showPassword={showPassword}
      />
      <ActionButton
        type="submit"
        isLoading={isLoading}
        gradient="from-blue-600 to-blue-500"
        shadow="hover:shadow-blue-500/25"
      >
        <span>Sign In</span>
        {!isLoading && <ArrowRight className="w-5 h-5" />}
      </ActionButton>
    </form>

    <div className="text-center">
      <p className="text-gray-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => setCurrentPage("signup")}
          className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          Sign up
        </button>
      </p>
    </div>
  </div>
);

export default LoginPage;
