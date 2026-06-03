import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, LayoutGrid, CheckCircle, TrendingUp, Clock, 
  Sparkles, Calendar, ArrowRight, Star, Users 
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [stats, setStats] = useState({ totalCards: 0, completedCards: 0, completionRate: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const { user } = useAuth();
  const location = useLocation();

  // Fetch boards and aggregated stats
  const fetchBoards = async () => {
    try {
      const res = await api.get('/boards');
      setBoards(res.data);
      return res.data;
    } catch (err) {
      toast.error('Failed to load boards');
      return [];
    }
  };

  const fetchAggregatedStats = useCallback(async () => {
    try {
      const boardsData = await fetchBoards();
      if (boardsData.length === 0) {
        setStats({ totalCards: 0, completedCards: 0, completionRate: 0 });
        setRecentActivity([]);
        return;
      }
      let totalCards = 0;
      let completedCards = 0;
      let allActivities = [];
      for (const board of boardsData) {
        try {
          const [statsRes, activitiesRes] = await Promise.all([
            api.get(`/analytics/board/${board._id}`),
            api.get(`/activities/board/${board._id}`)
          ]);
          totalCards += statsRes.data.totalCards || 0;
          completedCards += statsRes.data.completedCards || 0;
          // Collect recent activities (last 5)
          if (activitiesRes.data?.length) {
            allActivities.push(...activitiesRes.data.slice(0, 5).map(a => ({ ...a, boardName: board.name })));
          }
        } catch (err) {
          console.error(`Error fetching data for board ${board._id}`, err);
        }
      }
      const completionRate = totalCards === 0 ? 0 : ((completedCards / totalCards) * 100).toFixed(2);
      setStats({ totalCards, completedCards, completionRate });
      // Show latest 5 activities across all boards
      allActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentActivity(allActivities.slice(0, 5));
    } catch (err) {
      console.error('Aggregation error', err);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    fetchAggregatedStats();
  }, [fetchAggregatedStats, location.pathname]);

  const createBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      await api.post('/boards', { name: newBoardName });
      toast.success('Board created');
      setNewBoardName('');
      setShowNewBoard(false);
      await fetchBoards();
      await fetchAggregatedStats();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // Animations
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
      {/* Welcome Section with glass effect */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 mb-8 text-center md:text-left"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient flex items-center gap-2 justify-center md:justify-start">
              Welcome back, {user?.name} <Sparkles size={28} className="text-yellow-500" />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Here's what's happening with your tasks today.
            </p>
          </div>
          <button
            onClick={() => setShowNewBoard(true)}
            className="btn-gradient flex items-center gap-2 text-sm md:text-base"
          >
            <Plus size={18} /> New Board
          </button>
        </div>
      </motion.div>

      {/* KPI Stats Cards – Gradient borders, animated icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
      >
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-gray-500 text-sm">Total Tasks (All Boards)</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalCards}</p>
            </div>
            <LayoutGrid className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed Tasks</p>
              <p className="text-3xl font-bold text-green-600">{stats.completedCards}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold text-purple-600">{stats.completionRate}%</p>
            </div>
            <TrendingUp className="text-purple-500" size={32} />
          </div>
        </div>
      </motion.div>

      {/* Two Column Layout: Boards Grid + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Boards Section (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Star size={22} className="text-yellow-500" />
              Your Boards
            </h2>
            <span className="text-sm text-gray-500">{boards.length} board{boards.length !== 1 && 's'}</span>
          </div>
          {boards.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-gray-500 mb-4">No boards yet. Create your first board!</p>
              <button onClick={() => setShowNewBoard(true)} className="text-blue-600 hover:underline inline-flex items-center gap-1">
                Create Board <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {boards.map((board) => (
                <motion.div key={board._id} variants={item}>
                  <Link to={`/board/${board._id}`}>
                    <div className="group glass-card p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white group-hover:text-blue-600 transition">
                          {board.name}
                        </h3>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {board.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
                        <Calendar size={14} /> Created {formatDate(board.createdAt)}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                        <Users size={12} /> {board.members?.length || 1} members
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Recent Activity Feed (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="glass-card p-5 sticky top-24">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              Recent Activity
            </h2>
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {recentActivity.map((act, idx) => (
                  <div key={idx} className="border-l-2 border-blue-300 dark:border-blue-700 pl-3 py-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">{act.user?.name || 'Someone'}</span> {act.action}
                      {act.details?.title && <span className="italic"> "{act.details.title}"</span>}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(act.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Board Modal – still elegant */}
      <AnimatePresence>
        {showNewBoard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewBoard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">Create New Board</h3>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="e.g., Marketing Campaign"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 mb-5"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowNewBoard(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  Cancel
                </button>
                <button onClick={createBoard} className="btn-gradient">
                  Create Board
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}