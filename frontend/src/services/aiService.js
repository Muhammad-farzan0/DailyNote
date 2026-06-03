import api from './api';

export const generateDescription = (prompt) => api.post('/ai/generate-description', { prompt }).then(res => res.data.text);
export const suggestDeadline = (title) => api.post('/ai/suggest-deadline', { title }).then(res => new Date(res.data.suggestedDueDate));