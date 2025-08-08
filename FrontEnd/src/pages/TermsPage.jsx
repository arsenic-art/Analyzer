import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, X, CheckCircle } from "lucide-react";

const TermsPopup = ({ onAccept, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Totally Serious Terms
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Alright, listen up. This is a{" "}
                  <strong className="text-red-500">totally serious</strong>{" "}
                  terms and conditions page, where we lay down the law in a way
                  that even your grandma would approve of, so should you.
                  <br />
                  <br />
                  I just wanted to flex some fancy framer-motion moves 💃.
                  <br />
                  <br />
                  Also threw in some backend sorcery so it actually stores stuff
                  (kinda impressive, right?) 🐱
                  <br />
                  <br />
                  And believe me, no actual lawyers were involved in these
                  terms.
                </p>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={onAccept}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200"
              >
                No other choice Nig...
              </button>
              <button
                onClick={onAccept}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Fine, I Agree 😤</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsPopup;
