import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns';

export const formatDate = (date) => format(new Date(date), 'PPP');
export const relativeTime = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });
export const isOverdue = (dueDate) => dueDate && isBefore(new Date(dueDate), new Date());
export const formatDueDate = (dueDate) => isOverdue(dueDate) ? 'Overdue' : relativeTime(dueDate);