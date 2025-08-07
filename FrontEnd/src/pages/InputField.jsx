import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff  } from 'lucide-react';

const InputField = ({ icon: Icon, type = "text", name, placeholder, value, onChange, error, showToggle, onToggle, showPassword }) => (
  <div className="space-y-2">
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
      </div>
      <input
        type={showToggle ? (showPassword ? "text" : "password") : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className={`w-full pl-12 pr-${showToggle ? '12' : '4'} py-4 bg-slate-800/50 border ${
          error ? "border-red-500" : "border-slate-600"
        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm`}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 pr-4 flex items-center"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors" />
          )}
        </button>
      )}
    </div>
    {error && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-red-400 text-sm"
      >
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </motion.div>
    )}
  </div>
);

export default InputField;