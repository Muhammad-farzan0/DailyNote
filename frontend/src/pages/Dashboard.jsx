import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, CheckCircle, TrendingUp, Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [creatingBoard, setCreatingBoard] = useState(false);
  const [deletingBoardId, setDeletingBoardId] = useState(null);
  const [stats, setStats] = useState({ totalCards: 0, completedCards: 0, completionRate: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

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

  // ✅ FIX: Fetch recent activity from ALL boards, combine, sort, take latest 10
  const fetchRecentActivity = useCallback(async () => {
    const boardsData = await fetchBoards();
    if (boardsData.length === 0) {
      setRecentActivity([]);
      return;
    }
    setLoadingActivity(true);
    try {
      // Fetch activities from each board in parallel
      const activityPromises = boardsData.map(board =>
        api.get(`/activities/board/${board._id}`).then(res => res.data).catch(() => [])
      );
      const allActivitiesArrays = await Promise.all(activityPromises);
      // Flatten and combine all activities
      const allActivities = allActivitiesArrays.flat();
      // Sort by newest first
      allActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      // Take the latest 10
      setRecentActivity(allActivities.slice(0, 10));
    } catch (err) {
      console.error('Failed to load recent activity', err);
    } finally {
      setLoadingActivity(false);
    }
  }, []);

  const fetchAggregatedStats = useCallback(async () => {
    try {
      const boardsData = await fetchBoards();
      if (boardsData.length === 0) {
        setStats({ totalCards: 0, completedCards: 0, completionRate: 0 });
        return;
      }
      let totalCards = 0;
      let completedCards = 0;
      for (const board of boardsData) {
        try {
          const res = await api.get(`/analytics/board/${board._id}`);
          totalCards += res.data.totalCards || 0;
          completedCards += res.data.completedCards || 0;
        } catch (err) {
          console.error(`Error fetching stats for board ${board._id}:`, err);
        }
      }
      const completionRate = totalCards === 0 ? 0 : ((completedCards / totalCards) * 100).toFixed(2);
      setStats({ totalCards, completedCards, completionRate });
    } catch (err) {
      console.error('Aggregation error:', err);
    }
  }, []);

  const prefetchBoard = useCallback(async (boardId) => {
    try {
      await api.get(`/boards/${boardId}`);
    } catch (err) {
      // silent fail
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    fetchAggregatedStats();
    fetchRecentActivity();
  }, [fetchAggregatedStats, fetchRecentActivity, location.pathname]);

  const createBoard = async () => {
    if (!newBoardName.trim()) return;
    setCreatingBoard(true);
    try {
      await api.post('/boards', { name: newBoardName });
      toast.success('Board created');
      setNewBoardName('');
      setShowNewBoard(false);
      await Promise.all([fetchBoards(), fetchAggregatedStats(), fetchRecentActivity()]);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setCreatingBoard(false);
    }
  };

  const deleteBoard = async (boardId, boardName) => {
    if (!window.confirm(`Are you sure you want to delete the board "${boardName}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingBoardId(boardId);
    try {
      await api.delete(`/boards/${boardId}`);
      toast.success('Board deleted');
      await Promise.all([fetchBoards(), fetchAggregatedStats(), fetchRecentActivity()]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete board');
    } finally {
      setDeletingBoardId(null);
    }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  const formatActivityMessage = (act) => {
    const userName = act.user?.name || 'Someone';
    const action = act.action?.replace(/_/g, ' ') || act.action;
    let details = '';
    if (act.details?.title) details = ` "${act.details.title}"`;
    else if (act.details?.cardTitle) details = ` "${act.details.cardTitle}"`;
    else if (act.details?.userId) details = ` (user)`;
    return `${userName} ${action}${details}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name} 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your tasks and track progress</p>
        </div>
        <button onClick={() => setShowNewBoard(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
          <Plus size={18} /> New Board
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Total Tasks (All Boards)</p><p className="text-3xl font-bold">{stats.totalCards}</p></div>
            <LayoutGrid className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Completed (All Boards)</p><p className="text-3xl font-bold text-green-600">{stats.completedCards}</p></div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Completion Rate (Overall)</p><p className="text-3xl font-bold text-purple-600">{stats.completionRate}%</p></div>
            <TrendingUp className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      {/* Boards + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Boards</h2>
          {boards.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-gray-500">No boards yet. Create your first board!</p>
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {boards.map((board) => {
                const isBoardOwner = board.owner?._id === user?._id;
                return (
                  <motion.div key={board._id} variants={item}>
                    <div className="group relative bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                      <Link to={`/board/${board._id}`} className="block">
                        <h3 className="font-semibold text-lg">{board.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">Created by {board.owner?.name || 'you'}</p>
                      </Link>
                      {isBoardOwner && (
                        <button
                          onClick={() => deleteBoard(board._id, board.name)}
                          disabled={deletingBoardId === board._id}
                          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition disabled:opacity-50"
                          aria-label="Delete board"
                        >
                          {deletingBoardId === board._id ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Recent Activity Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-blue-500" />
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            {loadingActivity ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No recent activity</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {recentActivity.map((act, idx) => (
                  <div key={idx} className="border-l-2 border-blue-300 dark:border-blue-700 pl-3 py-1">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {formatActivityMessage(act)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Board Modal */}
      {showNewBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Board</h3>
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Board name"
              className="w-full p-2 border rounded-lg mb-4 dark:bg-gray-700"
              autoFocus
              disabled={creatingBoard}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNewBoard(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                disabled={creatingBoard}
              >
                Cancel
              </button>
              <button
                onClick={createBoard}
                disabled={creatingBoard || !newBoardName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {creatingBoard ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Plus size={16} />
                )}
                {creatingBoard ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}