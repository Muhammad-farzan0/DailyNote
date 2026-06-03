import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useEffect } from 'react';
import { Edit2, Calendar, MessageSquare, GripVertical, CheckCircle, AlertCircle } from 'lucide-react';
import TimerProgress from '../Timer/TimerProgress';
import CardModal from './CardModal';
import { formatDistanceToNow } from 'date-fns';

export default function CardItem({ card, isOverlay = false }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [isTimerExpiredLocally, setIsTimerExpiredLocally] = useState(false);

  useEffect(() => {
    if (card.status === 'in-progress' && card.timerStartedAt && card.timerDuration > 0) {
      const interval = setInterval(() => {
        const started = new Date(card.timerStartedAt);
        const elapsedMinutes = (Date.now() - started) / 60000;
        if (elapsedMinutes >= card.timerDuration) {
          setIsTimerExpiredLocally(true);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsTimerExpiredLocally(false);
    }
  }, [card.status, card.timerStartedAt, card.timerDuration]);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  let statusBg = '';
  let statusIcon = null;
  let statusText = '';
  let borderClass = '';

  if (isTimerExpiredLocally || card.status === 'incomplete') {
    statusBg = 'bg-red-50 dark:bg-red-900/30';
    borderClass = 'border-l-4 border-l-red-500 border-red-200 dark:border-red-800';
    statusIcon = <AlertCircle size={14} className="text-red-600 dark:text-red-400" />;
    statusText = 'Incomplete';
  } else if (card.status === 'done') {
    statusBg = 'bg-green-50 dark:bg-green-900/30';
    borderClass = 'border-l-4 border-l-green-500 border-green-200 dark:border-green-800';
    statusIcon = <CheckCircle size={14} className="text-green-600 dark:text-green-400" />;
    statusText = 'Done';
  } else {
    statusBg = 'bg-white dark:bg-gray-700';
    borderClass = 'border-gray-200 dark:border-gray-600';
  }

  const dueDate = card.dueDate ? new Date(card.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date();

  // Helper for label styles
  const getLabelClass = (label) => {
    const styles = {
      bug: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      feature: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      enhancement: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      urgent: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      documentation: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      question: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    };
    return styles[label] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`${statusBg} ${borderClass} rounded-md shadow-sm border hover:shadow-md transition`}
      >
        <div className="flex items-start p-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            style={{ touchAction: 'none' }}
          >
            <GripVertical size={16} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 flex-wrap">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white text-sm break-words">
                  {card.title}
                </h4>
                {/* Labels */}
                {card.labels && card.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {card.labels.map(label => (
                      <span key={label} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getLabelClass(label)}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {statusIcon && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-white/50 dark:bg-gray-800/50 shadow-sm">
                  {statusIcon}
                  <span className="text-gray-700 dark:text-gray-300">{statusText}</span>
                </span>
              )}
              {card.timerDuration > 0 && card.status === 'in-progress' && !isTimerExpiredLocally && (
                <TimerProgress card={card} />
              )}
            </div>

            {card.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{card.description}</p>
            )}

            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
              {dueDate && (
                <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
                  <Calendar size={12} /> {formatDistanceToNow(dueDate, { addSuffix: true })}
                </span>
              )}
              {card.comments?.length > 0 && (
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} /> {card.comments.length}
                </span>
              )}
              {card.assignees?.length > 0 && <span>👥 {card.assignees.length}</span>}
            </div>
          </div>

          <button
            onClick={handleEditClick}
            className="ml-2 p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            aria-label="Edit card"
          >
            <Edit2 size={14} />
          </button>
        </div>
      </div>
      <CardModal card={card} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}