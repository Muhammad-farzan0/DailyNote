import { useState, useEffect, useRef } from 'react';
import { useBoard } from '../../context/BoardContext';
import { useAuth } from '../../hooks/useAuth';
import { Edit2, Users, X, Search, UserPlus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function BoardHeader({ boardId }) {
  const { board, refresh } = useBoard();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const hasChecked = useRef(false);

  // Update local board name when board changes
  useEffect(() => {
    if (board) setName(board.name);
  }, [board]);

  // Ownership detection – runs whenever board or user changes
  useEffect(() => {
    if (board && user) {
      // board.owner can be an object { _id } or a string ID
      const ownerId = board.owner?._id || board.owner;
      const userId = user._id;
      const newIsOwner = ownerId === userId;
      setIsOwner(newIsOwner);
      hasChecked.current = true;
    } else if (board && !user && !hasChecked.current) {
      // User not ready yet – wait a moment, then refresh board to try again
      const timer = setTimeout(() => {
        refresh();
        hasChecked.current = true;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [board, user, refresh]);

  const updateName = async () => {
    if (!name.trim()) return;
    await api.put(`/boards/${boardId}`, { name });
    setEditing(false);
    refresh();
  };

  const searchUsers = async () => {
    if (searchEmail.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await api.get(`/users/search?email=${encodeURIComponent(searchEmail)}`);
      const existingIds = board?.members?.map(m => m._id) || [];
      const filtered = res.data.filter(u => !existingIds.includes(u._id));
      setSearchResults(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (showMembers) searchUsers();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchEmail, showMembers]);

  const addMember = async (userId) => {
    try {
      await api.post(`/boards/${boardId}/members`, { userId });
      toast.success('Member added');
      refresh();
      setSearchEmail('');
      setSearchResults([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const removeMember = async (userId) => {
    if (!window.confirm('Remove this member from the board?')) return;
    try {
      await api.delete(`/boards/${boardId}/members`, { data: { userId } });
      toast.success('Member removed');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (!board) return null;

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 flex-wrap">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold bg-transparent border-b border-blue-500 focus:outline-none"
                autoFocus
                onBlur={updateName}
                onKeyDown={(e) => e.key === 'Enter' && updateName()}
              />
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{board.name}</h1>
          )}
          {isOwner && (
            <button onClick={() => setEditing(true)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Edit2 size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMembers(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            <Users size={16} />
            <span className="text-sm font-medium">{board.members?.length || 1} members</span>
          </button>
        </div>
      </div>

      {/* Members Modal */}
      <AnimatePresence>
        {showMembers && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMembers(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-md p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Board Members</h3>
                <button onClick={() => setShowMembers(false)} className="p-1 rounded-full hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>

              {/* Current members list */}
              <div className="mb-4 space-y-2 max-h-48 overflow-y-auto">
                {board.members?.map(member => (
                  <div key={member._id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                        {member.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="font-medium text-sm truncate">{member.name}</p>
                        <p className="text-xs text-gray-500 truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {member._id === (board.owner?._id || board.owner) && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">Owner</span>
                      )}
                      {isOwner && member._id !== (board.owner?._id || board.owner) && (
                        <button
                          onClick={() => removeMember(member._id)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                          aria-label="Remove member"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add member section – only for owner */}
              {isOwner && (
                <div className="border-t pt-4">
                  <label className="text-sm font-medium mb-1 block">Add by email</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full pl-9 pr-3 py-2 border rounded-xl dark:bg-gray-700 text-sm"
                      />
                    </div>
                  </div>
                  {searching && <p className="text-sm text-gray-400 mt-1">Searching...</p>}
                  {searchResults.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {searchResults.map(user => (
                        <div key={user._id} className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <div className="truncate">
                            <p className="font-medium text-sm truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          <button onClick={() => addMember(user._id)} className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                            <UserPlus size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchEmail && !searching && searchResults.length === 0 && searchEmail.length > 2 && (
                    <p className="text-sm text-gray-500 mt-1">No users found</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}