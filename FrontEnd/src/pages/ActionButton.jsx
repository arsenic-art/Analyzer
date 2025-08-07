import React from "react";

const ActionButton = ({ onClick, disabled, gradient, shadow, children, type = "button", isLoading }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`w-full ${gradient} text-white font-semibold py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500/50 transform hover:scale-[1.02] transition-all duration-200 shadow-lg ${shadow} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2`}
    >
        {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
            children
        )}
    </button>
);

export default ActionButton;
