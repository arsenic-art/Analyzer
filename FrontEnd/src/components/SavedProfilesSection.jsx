import React from 'react';
import { Save, Trash2 } from 'lucide-react';

const SavedProfilesSection = ({ savedProfiles, onSave, onDelete, onLoad }) => (
  <div className="bg-slate-900/40 backdrop-blur-lg border-b border-slate-700/50 p-8 shadow-lg rounded-xl mx-auto max-w-7xl mt-8">
    <div className="max-w-7xl mx-auto space-y-6">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Save className="w-6 h-6 text-emerald-400" /> Saved Comparisons
      </h3>
      <button
        onClick={onSave}
        className="relative group inline-flex items-center space-x-2 px-8 py-3 rounded-full font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-md transition-all duration-300 hover:scale-105"
      >
        <Save className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        <span>Save Current Comparison</span>
      </button>

      {savedProfiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-white text-lg mb-3">Load or Delete Saved Pairs:</h4>
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-white">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="py-3 px-4 text-left">User 1 (LC/CF/AT)</th>
                  <th className="py-3 px-4 text-left">User 2 (LC/CF/AT)</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedProfiles.map((profilePair, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-slate-700 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer"
                    onClick={() => onLoad(profilePair)}
                  >
                    <td className="py-3 px-4 text-sm">
                      <span className="font-semibold text-blue-300">LC:</span> {profilePair.user1?.leetcode || "-"} <br />
                      <span className="font-semibold text-blue-300">CF:</span> {profilePair.user1?.codeforces || "-"} <br />
                      <span className="font-semibold text-blue-300">AT:</span> {profilePair.user1?.atcoder || "-"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className="font-semibold text-purple-300">LC:</span> {profilePair.user2?.leetcode || "-"} <br />
                      <span className="font-semibold text-purple-300">CF:</span> {profilePair.user2?.codeforces || "-"} <br />
                      <span className="font-semibold text-purple-300">AT:</span> {profilePair.user2?.atcoder || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(idx); }}
                        className="p-2 rounded-full bg-red-600/70 hover:bg-red-700 transition-colors duration-200 text-white"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default SavedProfilesSection;
