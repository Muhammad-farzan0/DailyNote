import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, CheckCircle, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [stats, setStats] = useState({ totalCards: 0, completedCards: 0, completionRate: 0 });
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

  // Pre‑fetch board data on hover (makes click instant)
  const prefetchBoard = useCallback(async (boardId) => {
    try {
      await api.get(`/boards/${boardId}`);
      // The response is cached by browser and also by BoardContext cache on first load
    } catch (err) {
      // Silent fail – pre‑fetch is optional
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

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name} 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your tasks and track progress</p>
        </div>
        <button onClick={() => setShowNewBoard(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
          <Plus size={18} /> New Board
        </button>
      </div>

      {/* Stats across all boards */}
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

      <h2 className="text-xl font-semibold mb-4">Your Boards</h2>
      {boards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500">No boards yet. Create your first board!</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {boards.map((board) => (
            <motion.div key={board._id} variants={item}>
              <Link
                to={`/board/${board._id}`}
                onMouseEnter={() => prefetchBoard(board._id)}
                onTouchStart={() => prefetchBoard(board._id)} // for mobile
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer">
                  <h3 className="font-semibold text-lg">{board.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">Created by {board.owner?.name || 'you'}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {showNewBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Board</h3>
            <input type="text" value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} placeholder="Board name" className="w-full p-2 border rounded-lg mb-4 dark:bg-gray-700" autoFocus />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowNewBoard(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={createBoard} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}