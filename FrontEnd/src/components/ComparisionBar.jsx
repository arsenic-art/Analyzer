import React from 'react';
import { Crown } from 'lucide-react';

const getScaleCeiling = (n) => {
  if (n <= 10) return 10;
  const orderOfMagnitude = Math.pow(10, Math.floor(Math.log10(n)));
  const firstDigit = Math.ceil(n / orderOfMagnitude);
  return firstDigit * orderOfMagnitude;
};


const ComparisonBar = ({ label, value1, value2, user1Name, user2Name, isSmallerBetter = false }) => {
  let winner = 'tie';
  const v1 = value1 ?? 0;
  const v2 = value2 ?? 0;

  if (isSmallerBetter) {
    if (v1 > 0 && (v2 <= 0 || v1 < v2)) winner = 'user1';
    else if (v2 > 0 && (v1 <= 0 || v2 < v1)) winner = 'user2';
  } else {  
    if (v1 > v2) winner = 'user1';
    else if (v2 > v1) winner = 'user2';
  }

  const scaleMax = getScaleCeiling(Math.max(v1, v2, 1));

  let width1, width2;

  if (isSmallerBetter) {
    width1 = v1 > 0 ? (1 - (v1 / (scaleMax + 1))) * 100 : 0;
    width2 = v2 > 0 ? (1 - (v2 / (scaleMax + 1))) * 100 : 0;
  } else {
    width1 = scaleMax > 0 ? (v1 / scaleMax) * 100 : 0;
    width2 = scaleMax > 0 ? (v2 / scaleMax) * 100 : 0;
  }

  const user1Color = winner === 'user1' ? 'bg-yellow-400' : 'bg-blue-500';
  const user2Color = winner === 'user2' ? 'bg-yellow-400' : 'bg-purple-500';

  return (
    <div className="py-4 border-b border-slate-700/50 last:border-b-0">
      <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
        <span className={`font-bold flex items-center gap-2 ${winner === 'user1' ? 'text-yellow-300' : 'text-white'}`}>
          {winner === 'user1' && <Crown className="w-4 h-4" />} {user1Name} : {v1.toLocaleString()}
        </span>
        <span className="text-sm font-medium text-slate-300 text-center px-2">{label}</span>
        <span className={`font-bold flex items-center gap-2 justify-end ${winner === 'user2' ? 'text-yellow-300' : 'text-white'}`}>
          {v2.toLocaleString()} :{user2Name} {winner === 'user2' && <Crown className="w-4 h-4" />}
        </span>
      </div>
      <div className="flex w-full items-center">
        <div className="flex-1 bg-slate-700/50 rounded-l-full h-3 overflow-hidden" style={{ direction: 'rtl' }}>
          <div className={`h-full rounded-l-full transition-all duration-500 ease-out ${user1Color}`} style={{ width: `${width1}%` }} />
        </div>
        <div className="w-1 h-5 bg-slate-600 mx-1"></div>
        <div className="flex-1 bg-slate-700/50 rounded-r-full h-3 overflow-hidden">
          <div className={`h-full rounded-r-full transition-all duration-500 ease-out ${user2Color}`} style={{ width: `${width2}%` }} />
        </div>
      </div>
      {isSmallerBetter && <p className="text-xs text-slate-500 text-center mt-1">(Lower is better)</p>}
    </div>
  );
};

export default ComparisonBar;
