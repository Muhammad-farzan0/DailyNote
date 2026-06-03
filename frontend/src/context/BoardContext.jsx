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
  const socket = useSocket();
  const { user } = useAuth(); // get current user

  const fetchBoard = useCallback(async () => {
    if (!boardId) return;
    try {
      const res = await api.get(`/boards/${boardId}`);
      setBoard(res.data);
      setLists(res.data.lists || []);
    } catch (err) {
      toast.error('Failed to load board');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const refresh = useCallback(() => {
    fetchBoard();
  }, [fetchBoard]);

  // Fetch board when boardId changes OR when user changes (after login)
  useEffect(() => {
    fetchBoard();
  }, [fetchBoard, user]); // 👈 re-fetch when user changes (important for OAuth)

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    socket.emit('join-board', boardId);
    const handleRefresh = () => fetchBoard();
    socket.on('card:moved', handleRefresh);
    socket.on('list:added', handleRefresh);
    socket.on('card:updated', handleRefresh);
    socket.on('timer:expired', handleRefresh);
    return () => {
      socket.off('card:moved', handleRefresh);
      socket.off('list:added', handleRefresh);
      socket.off('card:updated', handleRefresh);
      socket.off('timer:expired', handleRefresh);
    };
  }, [socket, boardId, fetchBoard]);

  const addList = async (title) => {
    try {
      await api.post('/lists', { title, boardId });
      socket?.emit('list:add', { boardId });
      await fetchBoard();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const moveCard = async (cardId, sourceListId, destListId) => {
    // Optimistic update
    setLists((prevLists) => {
      const newLists = [...prevLists];
      const sourceIndex = newLists.findIndex((l) => l._id === sourceListId);
      const destIndex = newLists.findIndex((l) => l._id === destListId);
      if (sourceIndex === -1 || destIndex === -1) return prevLists;
      const sourceList = newLists[sourceIndex];
      const cardIndex = sourceList.cards.findIndex((c) => c._id === cardId);
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

  const addCard = async (listId, title) => {
    try {
      await api.post('/cards', { title, listId });
      await fetchBoard();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <BoardContext.Provider value={{ board, lists, loading, addList, moveCard, addCard, refresh }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) throw new Error('useBoard must be used within BoardProvider');
  return context;
};