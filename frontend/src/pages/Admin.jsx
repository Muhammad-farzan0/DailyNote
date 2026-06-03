import { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    // Optional: implement admin users endpoint later
    // fetchUsers();
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get('/boards');
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">System Overview</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">Total Users</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">Total Boards</p>
            <p className="text-3xl font-bold">{boards.length}</p>
          </div>
        </div>
        <p className="text-gray-500 italic">Admin features: manage users, view all timers, global settings – Muhammad Farzan.</p>
      </div>
    </motion.div>
  );
}