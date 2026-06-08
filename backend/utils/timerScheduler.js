import cron from 'node-cron';
import Card from '../models/Card.js';
import List from '../models/List.js';
import Notification from '../models/Notification.js';

export const startTimerScheduler = (io) => {
  cron.schedule('* * * * *', async () => {
    console.log('⏰ Running timer expiry check...');
    const now = new Date();
    const cardsInProgress = await Card.find({ status: 'in-progress', timerStartedAt: { $ne: null }, timerExpired: false });
    for (const card of cardsInProgress) {
      const started = new Date(card.timerStartedAt);
      const elapsedMinutes = (now - started) / 60000;
      if (elapsedMinutes >= card.timerDuration && card.timerDuration > 0) {
        const incompleteList = await List.findOne({ board: card.board, title: 'Incomplete' });
        if (incompleteList) {
          // Move card
          const currentList = await List.findById(card.list);
          currentList.cards = currentList.cards.filter(c => c.toString() !== card._id.toString());
          await currentList.save();
          card.list = incompleteList._id;
          card.status = 'incomplete';
          card.timerExpired = true;
          await card.save();
          incompleteList.cards.push(card._id);
          await incompleteList.save();
          // Notify assignees
          for (const userId of card.assignees) {
            const notification = await Notification.create({
              user: userId,
              type: 'timer_expiry',
              title: 'Timer Expired',
              message: `Task "${card.title}" timer expired and moved to Incomplete.`,
              link: `/board/${card.board}`
            });
            io.to(`user_${userId}`).emit('new-notification', notification);
          }
          io.to(card.board.toString()).emit('timer:expired', { cardId: card._id, boardId: card.board });
        }
      }
    }
  });
};