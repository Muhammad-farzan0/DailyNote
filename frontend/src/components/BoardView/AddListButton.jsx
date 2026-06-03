import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddListButton({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title);
      setTitle('');
      setOpen(false);
    }
  };

  return (
    <div className="w-80 flex-shrink-0">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-3 flex items-center gap-2 text-gray-600 dark:text-gray-300 transition"
        >
          <Plus size={18} /> Add another list
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="List title..."
            className="w-full p-2 border rounded dark:bg-gray-800 mb-2"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Add</button>
            <button onClick={() => setOpen(false)} className="p-1"><X size={18} /></button>
          </div>
        </motion.div>
      )}
    </div>
  );
}