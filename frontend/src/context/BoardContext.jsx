import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';

const BoardContext = createContext();

export const BoardProvider = ({ children, boardId }) => {
  const [lists, setLists] = useState([]);
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const socket = useSocket();
  const { user } = useAuth();

  const fetchBoard = useCallback(async () => {
    if (!boardId) return;
    try {
      const res = await api.get(`/boards/${boardId}`);
      setBoard(res.data);
      setLists(res.data.lists || []);
      if (user) {
        const ownerId = res.data.owner?._id || res.data.owner;
        setIsOwner(ownerId === user._id);
      }
    } catch (err) {
      toast.error('Failed to load board');
    } finally {
      setLoading(false);
    }
  }, [boardId, user]);

  const refresh = useCallback(() => fetchBoard(), [fetchBoard]);

  // Initial load + when user changes
  useEffect(() => {
    if (!user) return;
    fetchBoard();
  }, [fetchBoard, user]);

  // Socket listeners – still useful for real‑time updates from other users
  useEffect(() => {
    if (!socket || !boardId) return;
    socket.emit('join-board', boardId);
    const handleCardMoved = (data) => {
      // optional: you could also update optimistically, but for now just refresh
      fetchBoard();
    };
    socket.on('card:moved', handleCardMoved);
    socket.on('list:added', () => fetchBoard());
    socket.on('card:updated', () => fetchBoard());
    return () => {
      socket.off('card:moved', handleCardMoved);
      socket.off('list:added', () => fetchBoard());
      socket.off('card:updated', () => fetchBoard());
    };
  }, [socket, boardId, fetchBoard]);

  // ---------- Granular state updates (no full refresh) ----------
  const updateCardInState = (cardId, updatedData) => {
    setLists(prevLists =>
      prevLists.map(list => ({
        ...list,
        cards: list.cards.map(card =>
          card._id === cardId ? { ...card, ...updatedData } : card
        ),
      }))
    );
  };

  const deleteCardFromState = (cardId, listId) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list._id === listId
          ? { ...list, cards: list.cards.filter(c => c._id !== cardId) }
          : list
      )
    );
  };

  const addCardToState = (newCard, listId) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list._id === listId
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      )
    );
  };

  // ---------- API calls that update state locally first ----------
  const addCard = async (listId, title) => {
    try {
      const res = await api.post('/cards', { title, listId });
      addCardToState(res.data, listId);
      toast.success('Card added');
    } catch (err) {
      toast.error(err.response?.data?.message);
      fetchBoard(); // revert if error
    }
  };

  const moveCard = async (cardId, sourceListId, destListId) => {
    // Optimistic update (already done in your code)
    setLists(prevLists => {
      const newLists = [...prevLists];
      const sourceIndex = newLists.findIndex(l => l._id === sourceListId);
      const destIndex = newLists.findIndex(l => l._id === destListId);
      if (sourceIndex === -1 || destIndex === -1) return prevLists;
      const sourceList = newLists[sourceIndex];
      const cardIndex = sourceList.cards.findIndex(c => c._id === cardId);
      if (cardIndex === -1) return prevLists;
      const [movedCard] = sourceList.cards.splice(cardIndex, 1);
      movedCard.list = destListId;
      const destTitle = newLists[destIndex].title;
      if (destTitle === 'In Progress') movedCard.status = 'in-progress';
      else if (destTitle === 'Completed') movedCard.status = 'done';
      else if (destTitle === 'Incomplete') movedCard.status = 'incomplete';
      else movedCard.status = 'todo';
      newLists[destIndex].cards.push(movedCard);
      return newLists;
    });
    try {
      await api.put('/cards/move', { cardId, sourceListId, destListId });
      socket?.emit('card:move', { boardId, cardId, sourceListId, destListId });
    } catch (err) {
      toast.error('Move failed, reverting...');
      fetchBoard();
    }
  };

  const addList = async (title) => {
    try {
      const res = await api.post('/lists', { title, boardId });
      setLists(prev => [...prev, res.data]);
      socket?.emit('list:add', { boardId });
    } catch (err) {
      toast.error(err.response?.data?.message);
      fetchBoard();
    }
  };

  return (
    <BoardContext.Provider
      value={{
        board,
        lists,
        loading,
        isOwner,
        addList,
        moveCard,
        addCard,
        updateCardInState,
        deleteCardFromState,
        refresh, // kept for emergencies
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) throw new Error('useBoard must be used within BoardProvider');
  return context;
};