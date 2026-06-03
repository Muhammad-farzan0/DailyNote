import api from './api';

export const fetchBoards = () => api.get('/boards').then(res => res.data);
export const createBoard = (name) => api.post('/boards', { name }).then(res => res.data);
export const getBoard = (id) => api.get(`/boards/${id}`).then(res => res.data);
export const updateBoard = (id, name) => api.put(`/boards/${id}`, { name }).then(res => res.data);
export const deleteBoard = (id) => api.delete(`/boards/${id}`);
export const addMember = (boardId, userId) => api.post(`/boards/${boardId}/members`, { userId }).then(res => res.data);