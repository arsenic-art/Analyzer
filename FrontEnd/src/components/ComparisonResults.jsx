import React from 'react';
import { Crown } from 'lucide-react';
import { PLATFORMS, METRIC_CONFIG, SMALLER_BETTER_METRICS } from '../utils/constants';
import { compareMetricValue } from '../utils/metrics';
import ComparisonBar from './ComparisionBar';

const ComparisonResults = ({ user1Metrics, user2Metrics, user1Usernames, user2Usernames }) => {
  const getWinner = (metrics1, metrics2, keys) => {
    let wins1 = 0, wins2 = 0;
    keys.forEach(key => {
      if (metrics1.hasOwnProperty(key) && metrics2.hasOwnProperty(key)) {
        const winner = compareMetricValue(metrics1[key], metrics2[key], key);
        if (winner === 'user1') wins1++;
        if (winner === 'user2') wins2++;
      }
    });
    if (wins1 > wins2) return 'user1';
    if (wins2 > wins1) return 'user2';
    return 'tie';
  };

  const overallWinner = getWinner(user1Metrics, user2Metrics, Object.keys(METRIC_CONFIG).flatMap(p => METRIC_CONFIG[p].map(m => m.key)));

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-white mb-2">Coding Battle Results</h1>
          {overallWinner !== 'tie' && (
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-200 border border-yellow-400/30 px-4 py-2 rounded-full text-sm font-semibold">
              <Crown className="w-4 h-4" />
              Champion: {overallWinner === 'user1' ? (user1Usernames.leetcode || user1Usernames.codeforces || user1Usernames.atcoder || 'User 1') : (user2Usernames.leetcode || user2Usernames.codeforces || user2Usernames.atcoder || 'User 2')}
            </div>
          )}
        </div>

        <div className="grid gap-4">
          {PLATFORMS.map((platform) => {
            const platformMetrics = METRIC_CONFIG[platform.id] || [];
            const hasData = platformMetrics.some(m => user1Metrics[m.key] !== undefined && user2Metrics[m.key] !== undefined);
            if (!hasData) return null;

            const platformWinner = getWinner(user1Metrics, user2Metrics, platformMetrics.map(m => m.key));

            return (
              <div key={platform.id} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-bold ${platform.textColor}`}>{platform.name}</h3>
                  {platformWinner !== 'tie' && (
                    <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded-full text-xs">
                      <Crown className="w-3 h-3" />
                      <span>{platformWinner === 'user1' ? (user1Usernames[platform.id] || 'User 1') : (user2Usernames[platform.id] || 'User 2')} wins</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-0">
                  {platformMetrics.map((metricConf, idx) => (
                    (user1Metrics[metricConf.key] !== undefined || user2Metrics[metricConf.key] !== undefined) &&
                    <ComparisonBar
                      key={idx}
                      label={metricConf.label}
                      value1={user1Metrics[metricConf.key]}
                      value2={user2Metrics[metricConf.key]}
                      user1Name={user1Usernames[platform.id] || 'User 1'}
                      user2Name={user2Usernames[platform.id] || 'User 2'}
                      isSmallerBetter={SMALLER_BETTER_METRICS.has(metricConf.key)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComparisonResults;
