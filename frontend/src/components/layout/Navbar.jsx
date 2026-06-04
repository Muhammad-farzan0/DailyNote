import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, LogOut, Menu, Bell, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useSocket();
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.success(notification.message);
    };
    socket.on('new-notification', handleNewNotification);
    return () => socket.off('new-notification', handleNewNotification);
  }, [socket]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => (n._id === id ? { ...n, read: true } : n)));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    await api.put('/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    toast.success('All notifications marked as read');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'timer_expiry': return '⏰';
      case 'mention': return '👤';
      default: return '📌';
    }
  };

  return (
    <header className="sticky top-0 z-30 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition md:hidden">
          <Menu size={24} />
        </button>
        <div className="hidden md:block"><h2 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h2></div>
        <div className="flex items-center gap-3 ml-auto">
          {/* Notifications Bell */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setShowDropdown(!showDropdown)} className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed left-4 right-4 top-16 md:absolute md:left-auto md:right-0 md:top-full md:mt-2 md:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                >
                  <div className="flex justify-between items-center px-4 py-2 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    <div className="flex gap-2">
                      {notifications.some(n => !n.read) && (
                        <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>
                      )}
                      <button onClick={() => setShowDropdown(false)} className="md:hidden p-1 rounded-full hover:bg-gray-100">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No notifications</div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif._id} className={`p-3 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium break-words">{notif.title}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 break-words">{notif.message}</p>
                              <Link to={notif.link} className="text-xs text-blue-500 hover:underline" onClick={() => markAsRead(notif._id)}>
                                View
                              </Link>
                            </div>
                            {!notif.read && (
                              <button onClick={() => markAsRead(notif._id)} className="text-green-500 flex-shrink-0"><Check size={14} /></button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={toggle} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium hidden sm:inline-block">{user?.name}</span>
          </div>
          <button onClick={logout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-red-500">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}