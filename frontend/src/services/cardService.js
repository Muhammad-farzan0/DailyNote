import api from './api';

export const createCard = (title, listId) => api.post('/cards', { title, listId }).then(res => res.data);
export const moveCard = (cardId, sourceListId, destListId) => api.put('/cards/move', { cardId, sourceListId, destListId }).then(res => res.data);
export const updateCard = (cardId, data) => api.put(`/cards/${cardId}`, data).then(res => res.data);
export const deleteCard = (cardId) => api.delete(`/cards/${cardId}`);
export const setCardTimer = (cardId, minutes) => api.put(`/cards/${cardId}/timer`, { minutes }).then(res => res.data);
export const addComment = (cardId, text) => api.post(`/cards/${cardId}/comments`, { text }).then(res => res.data);