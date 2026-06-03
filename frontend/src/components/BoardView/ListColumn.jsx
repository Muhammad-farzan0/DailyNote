import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CardItem from './CardItem';
import { useState } from 'react';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useBoard } from '../../context/BoardContext';
import toast from 'react-hot-toast';

// Default list titles that cannot be deleted
const DEFAULT_LIST_TITLES = ['To Do', 'In Progress', 'Completed', 'Incomplete'];

export default function ListColumn({ list }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: list._id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const [newCardTitle, setNewCardTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const { refresh } = useBoard();
  const [deleting, setDeleting] = useState(false);

  const isDeletable = !DEFAULT_LIST_TITLES.includes(list.title);

  const addCard = async () => {
    if (!newCardTitle.trim()) return;
    try {
      await api.post('/cards', { title: newCardTitle, listId: list._id });
      setNewCardTitle('');
      setAdding(false);
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const deleteList = async () => {
    if (!window.confirm(`Are you sure you want to delete the list "${list.title}" and all its cards? This action cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/lists/${list._id}`);
      toast.success('List deleted');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete list');
    } finally {
      setDeleting(false);
    }
  };

  const cardIds = list.cards?.map(c => c._id) || [];

  return (
    <div ref={setNodeRef} style={style} className="w-80 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex flex-col max-h-full">
      <div className="flex justify-between items-center mb-3 px-1">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical size={18} className="text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">{list.title}</h3>
          <span className="text-xs bg-gray-300 dark:bg-gray-600 px-2 py-0.5 rounded-full">{list.cards?.length || 0}</span>
        </div>
        {isDeletable && (
          <button
            onClick={deleteList}
            disabled={deleting}
            className="p-1 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
            aria-label="Delete list"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-[100px]">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {list.cards?.map(card => <CardItem key={card._id} card={card} />)}
        </SortableContext>
      </div>

      {adding ? (
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <input
            autoFocus
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Enter card title..."
            className="w-full p-2 border rounded dark:bg-gray-700 text-sm mb-2"
            onKeyDown={(e) => e.key === 'Enter' && addCard()}
          />
          <div className="flex gap-2">
            <button onClick={addCard} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Add</button>
            <button onClick={() => setAdding(false)} className="text-gray-500 text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="mt-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm flex items-center gap-1">
          <Plus size={14} /> Add a card
        </button>
      )}
    </div>
  );
}