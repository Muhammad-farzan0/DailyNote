import Card from '../models/Card.js';
import Board from '../models/Board.js';
import ActivityLog from '../models/ActivityLog.js';
import List from '../models/List.js';

export const getBoardAnalytics = async (req, res, next) => {
  try {
    const boardId = req.params.boardId;
    const board = await Board.findById(boardId);
    if (!board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const cards = await Card.find({ board: boardId }).populate('assignees', 'name email');
    const lists = await List.find({ board: boardId }).sort('order');

    // Count cards per list
    const listCounts = lists.map(list => ({
      name: list.title,
      count: cards.filter(card => card.list.toString() === list._id.toString()).length,
      color: getListColor(list.title) // helper for consistent colors
    }));

    // Status counts (for completion pie chart and overall metrics)
    const totalCards = cards.length;
    const completedCards = cards.filter(c => c.status === 'done').length;
    const completionRate = totalCards === 0 ? 0 : (completedCards / totalCards) * 100;

    const statusCounts = {
      todo: cards.filter(c => c.status === 'todo').length,
      inProgress: cards.filter(c => c.status === 'in-progress').length,
      completed: completedCards,
      incomplete: cards.filter(c => c.status === 'incomplete').length,
    };

    // Average time per task (completed cards with timer)
    let avgTime = 0;
    const completedWithTimer = cards.filter(c => c.status === 'done' && c.timerStartedAt && c.updatedAt);
    if (completedWithTimer.length > 0) {
      let totalMinutes = 0;
      for (const card of completedWithTimer) {
        const started = new Date(card.timerStartedAt);
        const completedAt = new Date(card.updatedAt);
        totalMinutes += (completedAt - started) / 60000;
      }
      avgTime = totalMinutes / completedWithTimer.length;
    }

    // Timer statistics
    const tasksWithTimer = cards.filter(c => c.timerDuration > 0).length;
    const tasksWithExpiredTimer = cards.filter(c => c.timerExpired === true).length;
    const averageTimerDuration = cards.filter(c => c.timerDuration > 0).reduce((sum, c) => sum + c.timerDuration, 0) / (tasksWithTimer || 1);

    // Due date distribution
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next7Days = new Date(today);
    next7Days.setDate(today.getDate() + 7);
    let dueThisWeek = 0;
    let overdue = 0;
    let noDueDate = 0;
    cards.forEach(card => {
      if (!card.dueDate) {
        noDueDate++;
        return;
      }
      const due = new Date(card.dueDate);
      due.setHours(0, 0, 0, 0);
      if (due < today) overdue++;
      else if (due <= next7Days) dueThisWeek++;
    });

    // Tasks per assignee
    const assigneeMap = new Map();
    cards.forEach(card => {
      card.assignees.forEach(assignee => {
        const name = assignee.name || assignee._id;
        assigneeMap.set(name, (assigneeMap.get(name) || 0) + 1);
      });
    });
    const tasksPerAssignee = Array.from(assigneeMap.entries()).map(([name, count]) => ({ name, count }));

    // Daily activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activities = await ActivityLog.find({ board: boardId, createdAt: { $gte: sevenDaysAgo } });
    const dailyActivity = {};
    activities.forEach(act => {
      const day = act.createdAt.toISOString().split('T')[0];
      dailyActivity[day] = (dailyActivity[day] || 0) + 1;
    });

    res.json({
      totalCards,
      completedCards,
      completionRate: completionRate.toFixed(2),
      averageTimePerTask: avgTime.toFixed(2),
      statusCounts,      // for pie chart
      listCounts,        // for bar chart – includes all lists
      timerStats: {
        tasksWithTimer,
        tasksWithExpiredTimer,
        averageTimerDuration: averageTimerDuration.toFixed(1),
      },
      dueDateStats: {
        dueThisWeek,
        overdue,
        noDueDate,
      },
      tasksPerAssignee,
      dailyActivity
    });
  } catch (err) {
    next(err);
  }
};

// Helper for consistent list colors (you can extend)
function getListColor(title) {
  const colors = {
    'To Do': '#3b82f6',
    'In Progress': '#f59e0b',
    'Completed': '#10b981',
    'Incomplete': '#ef4444',
  };
  if (colors[title]) return colors[title];
  // For custom lists, generate a consistent hash-based color
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
}