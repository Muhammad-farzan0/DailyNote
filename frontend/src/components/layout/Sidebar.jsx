import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, BarChart3, Settings, User, ExternalLink, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import myIcon from '../../assets/icons/my-icon.png';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/admin', icon: Settings, label: 'Admin' },
  { path: '/documentation', icon: BookOpen, label: 'Documentation' },
];

export default function Sidebar({ isOpen, onClose }) {
  const openPortfolio = () => {
    window.open('https://protfolio-with-ai-chatbox-react.vercel.app/', '_blank');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:relative md:shadow-none
        `}
      >
        <div className="flex justify-end p-3 md:hidden">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <img src={myIcon} alt="DailyNote Icon" className="w-12 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">DailyNote</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>

          <button
            onClick={() => {
              openPortfolio();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition group"
          >
            <User size={20} className="group-hover:text-purple-500 transition" />
            <span>My Portfolio</span>
            <ExternalLink size={14} className="ml-auto opacity-60" />
          </button>
        </nav>
      </aside>
    </>
  );
}