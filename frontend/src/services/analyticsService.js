import api from './api';

export const getBoardAnalytics = (boardId) => api.get(`/analytics/board/${boardId}`).then(res => res.data);