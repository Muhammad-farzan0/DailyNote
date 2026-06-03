import { useParams } from 'react-router-dom';
import { BoardProvider, useBoard } from '../context/BoardContext';
import { DndContext, closestCorners, DragOverlay, defaultDropAnimation } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import ListColumn from '../components/BoardView/ListColumn';
import CardItem from '../components/BoardView/CardItem';
import AddListButton from '../components/BoardView/AddListButton';
import BoardHeader from '../components/BoardView/BoardHeader';

function BoardContent() {
  const { boardId } = useParams();
  const { lists, loading, moveCard, addList } = useBoard();
  const [activeCard, setActiveCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDragStart = (event) => {
    const { active } = event;
    const card = lists.flatMap(l => l.cards).find(c => c._id === active.id);
    setActiveCard(card);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    let sourceListId = null;
    let destListId = null;
    for (const list of lists) {
      if (list.cards.some(c => c._id === active.id)) sourceListId = list._id;
      if (list.cards.some(c => c._id === over.id)) destListId = list._id;
      if (over.id === list._id) destListId = list._id;
    }
    if (sourceListId && destListId && sourceListId !== destListId) {
      await moveCard(active.id, sourceListId, destListId);
    }
  };

  const dropAnimation = {
    ...defaultDropAnimation,
    duration: 200,
    easing: 'ease-in-out',
  };

  // Filter cards based on search query (title or description)
  const filterCards = (cards) => {
    if (!searchQuery.trim()) return cards;
    const lowerQuery = searchQuery.toLowerCase();
    return cards.filter(card =>
      card.title.toLowerCase().includes(lowerQuery) ||
      (card.description && card.description.toLowerCase().includes(lowerQuery))
    );
  };

  // Apply filter to each list
  const filteredLists = lists.map(list => ({
    ...list,
    cards: filterCards(list.cards || [])
  }));

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="h-full flex flex-col">
      <BoardHeader boardId={boardId} />
      
      {/* Search bar - right aligned, responsive */}
      <div className="flex justify-end px-2 py-3 mb-2">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search cards by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-4 flex-1">
          <SortableContext items={lists.map(l => l._id)} strategy={horizontalListSortingStrategy}>
            {filteredLists.map((list) => (
              <ListColumn key={list._id} list={list} />
            ))}
          </SortableContext>
          <AddListButton onAdd={addList} />
        </div>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeCard ? <CardItem card={activeCard} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
      
      {/* No results message */}
      {searchQuery && filteredLists.every(list => list.cards.length === 0) && (
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-500">No cards match "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

export default function Board() {
  const { boardId } = useParams();
  return (
    <BoardProvider boardId={boardId}>
      <BoardContent />
    </BoardProvider>
  );
}