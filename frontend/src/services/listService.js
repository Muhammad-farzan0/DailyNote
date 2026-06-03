import api from './api';

export const createList = (title, boardId) => api.post('/lists', { title, boardId }).then(res => res.data);
export const updateList = (id, title) => api.put(`/lists/${id}`, { title }).then(res => res.data);
export const deleteList = (id) => api.delete(`/lists/${id}`);