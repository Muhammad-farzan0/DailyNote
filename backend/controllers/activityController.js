import ActivityLog from '../models/ActivityLog.js';

export const getBoardActivities = async (req, res, next) => {
  try {
    const activities = await ActivityLog.find({ board: req.params.boardId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(activities);
  } catch (err) {
    next(err);
  }
};