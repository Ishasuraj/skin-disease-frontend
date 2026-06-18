import { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { History, Loader2 } from 'lucide-react';

const severityBadge = {
  Low:    'bg-green-100 dark:bg-green-900/30 text-green-605 dark:text-green-400',
  Medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-605 dark:text-amber-400',
  High:   'bg-red-100 dark:bg-red-900/30 text-red-605 dark:text-red-400',
};

const RecentPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'predictions'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => {
        const data = doc.data();
        
        let timeStr = 'N/A';
        if (data.createdAt) {
          const dateVal = data.createdAt.toDate();
          timeStr = dateVal.toLocaleDateString('en-IN') + ' ' + dateVal.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        }

        return {
          id: doc.id,
          user: data.userName || 'Unknown User',
          email: data.userEmail || '',
          disease: data.disease || 'Unknown',
          confidence: (data.confidence || 0) + '%',
          severity: data.severity || 'Medium',
          time: timeStr,
          isConsensus: data.isConsensus || false
        };
      });
      setPredictions(list);
    } catch (err) {
      console.error('Error fetching recent predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">

      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Recent Predictions</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Latest AI predictions across all users</p>
        </div>
        <button
          onClick={fetchRecent}
          disabled={loading}
          className="text-xs font-semibold text-blue-600 hover:text-blue-750 disabled:opacity-40"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      )}

      {/* Empty State */}
      {!loading && predictions.length === 0 && (
        <div className="p-12 text-center text-slate-450 dark:text-slate-500 text-sm">
          No predictions recorded yet.
        </div>
      )}

      {/* List */}
      {!loading && predictions.length > 0 && (
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {predictions.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-bold shrink-0">
                  {item.user[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{item.user}</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-450">({item.email})</span>
                    {item.isConsensus && (
                      <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-bold border border-indigo-100 dark:border-indigo-900/40">
                        Consensus
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{item.disease}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 hidden sm:block">
                  {item.confidence}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${severityBadge[item.severity]}`}>
                  {item.severity}
                </span>
                <span className="text-[11px] text-slate-400 hidden md:block">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentPredictions;