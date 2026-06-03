import Card from '../models/Card.js';
import Board from '../models/Board.js';
import ActivityLog from '../models/ActivityLog.js';

export const getBoardAnalytics = async (req, res, next) => {
  try {
    const boardId = req.params.boardId;
    const board = await Board.findById(boardId);
    if (!board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const cards = await Card.find({ board: boardId });
    const totalCards = cards.length;
    const completedCards = cards.filter(c => c.status === 'done').length;
    const completionRate = totalCards === 0 ? 0 : (completedCards / totalCards) * 100;

    // ✅ Status counts for bar chart
    const statusCounts = {
      todo: cards.filter(c => c.status === 'todo').length,
      inProgress: cards.filter(c => c.status === 'in-progress').length,
      completed: completedCards,
      incomplete: cards.filter(c => c.status === 'incomplete').length,
    };

    // Average time (only for completed cards that had timer)
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
      statusCounts,   // new field
      dailyActivity
    });
  } catch (err) {
    next(err);
  }
};