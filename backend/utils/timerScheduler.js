import cron from 'node-cron';
import Card from '../models/Card.js';
import List from '../models/List.js';
import Notification from '../models/Notification.js';

export const startTimerScheduler = (io) => {
  console.log('🕒 Timer scheduler started – will run every minute');
  
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    try {
      const cardsInProgress = await Card.find({ 
        status: 'in-progress', 
        timerStartedAt: { $ne: null }, 
        timerExpired: false,
        timerDuration: { $gt: 0 }
      });
      
      for (const card of cardsInProgress) {
        const started = new Date(card.timerStartedAt);
        const elapsedMinutes = (now - started) / 60000;
        if (elapsedMinutes >= card.timerDuration) {
          // Find "Incomplete" list
          const incompleteList = await List.findOne({ board: card.board, title: 'Incomplete' });
          if (!incompleteList) continue;

          // Remove from current list
          const currentList = await List.findById(card.list);
          if (currentList) {
            currentList.cards = currentList.cards.filter(c => c.toString() !== card._id.toString());
            await currentList.save();
          }

          // Update card
          card.list = incompleteList._id;
          card.status = 'incomplete';
          card.timerExpired = true;
          await card.save();

          // Add to incomplete list
          incompleteList.cards.push(card._id);
          await incompleteList.save();

          // Create notifications for assignees
          for (const userId of card.assignees) {
            const notification = await Notification.create({
              user: userId,
              type: 'timer_expiry',
              title: 'Timer Expired',
              message: `Task "${card.title}" timer expired and moved to Incomplete.`,
              link: `/board/${card.board}`
            });
            // Emit real‑time notification
            io.to(`user_${userId}`).emit('new-notification', notification);
          }

          // Emit board update
          io.to(card.board.toString()).emit('timer:expired', { 
            cardId: card._id, 
            boardId: card.board,
            newListId: incompleteList._id
          });
        }
      }
    } catch (err) {
      console.error('Timer scheduler error:', err);
    }
  });
};