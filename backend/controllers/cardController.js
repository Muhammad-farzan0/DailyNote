import Card from '../models/Card.js';
import List from '../models/List.js';
import Board from '../models/Board.js';
import ActivityLog from '../models/ActivityLog.js';
import Notification from '../models/Notification.js';

function mapListTitleToStatus(listTitle) {
  if (listTitle === 'In Progress') return 'in-progress';
  if (listTitle === 'Completed') return 'done';
  if (listTitle === 'Incomplete') return 'incomplete';
  return 'todo';
}

export const createCard = async (req, res, next) => {
  try {
    const { title, description, listId } = req.body;
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: 'List not found' });
    const board = await Board.findById(list.board);
    if (!board.members.includes(req.user._id)) return res.status(403).json({ message: 'Not authorized' });
    const order = list.cards.length;
    const card = await Card.create({
      title,
      description,
      list: listId,
      board: board._id,
      order,
      status: mapListTitleToStatus(list.title)
    });
    list.cards.push(card._id);
    await list.save();
    await ActivityLog.create({ user: req.user._id, board: board._id, action: 'created_card', details: { cardId: card._id, title } });
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};

export const moveCard = async (req, res, next) => {
  try {
    const { cardId, destListId } = req.body;
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    const destList = await List.findById(destListId);
    if (!destList) return res.status(404).json({ message: 'Destination list not found' });
    const board = await Board.findById(card.board);
    if (!board.members.includes(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    const oldList = await List.findById(card.list);
    oldList.cards = oldList.cards.filter(c => c.toString() !== cardId);
    await oldList.save();

    card.list = destListId;
    card.status = mapListTitleToStatus(destList.title);
    if (destList.title === 'In Progress' && card.timerDuration > 0 && !card.timerStartedAt) {
      card.timerStartedAt = new Date();
      card.timerExpired = false;
    }
    await card.save();

    destList.cards.push(card._id);
    await destList.save();

    await ActivityLog.create({ user: req.user._id, board: board._id, action: 'moved_card', details: { cardId, fromList: oldList.title, toList: destList.title } });
    res.json(card);
  } catch (err) {
    next(err);
  }
};

export const setTimer = async (req, res, next) => {
  try {
    const { minutes } = req.body;
    const card = await Card.findById(req.params.cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    const board = await Board.findById(card.board);
    if (!board.members.includes(req.user._id)) return res.status(403).json({ message: 'Not authorized' });
    card.timerDuration = minutes;
    if (card.status === 'in-progress' && !card.timerStartedAt && minutes > 0) {
      card.timerStartedAt = new Date();
    }
    await card.save();
    res.json(card);
  } catch (err) {
    next(err);
  }
};

export const updateCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    const board = await Board.findById(card.board);
    if (!board.members.includes(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    // Store old assignees for mention detection
    const oldAssignees = card.assignees.map(id => id.toString());
    const allowedUpdates = ['title', 'description', 'labels', 'dueDate', 'checklist'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) card[field] = req.body[field];
    });
    if (req.body.assignees) card.assignees = req.body.assignees;
    await card.save();

    // Handle mention notifications
    if (req.body.assignees) {
      const newAssignees = req.body.assignees.map(id => id.toString());
      const added = newAssignees.filter(id => !oldAssignees.includes(id));
      const io = req.app.get('io');
      for (const userId of added) {
        const notification = await Notification.create({
          user: userId,
          type: 'mention',
          title: 'You were mentioned',
          message: `${req.user.name} assigned you to card "${card.title}"`,
          link: `/board/${card.board}`
        });
        io.to(`user_${userId}`).emit('new-notification', notification);
      }
    }

    res.json(card);
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    const board = await Board.findById(card.board);
    if (!board.members.includes(req.user._id)) return res.status(403).json({ message: 'Not authorized' });
    card.comments.push({ user: req.user._id, text: req.body.text });
    await card.save();
    res.json(card);
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    const board = await Board.findById(card.board);
    if (!board.members.includes(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    await ActivityLog.create({
      user: req.user._id,
      board: card.board,
      action: 'deleted_card',
      details: { cardId: card._id, title: card.title }
    });

    const list = await List.findById(card.list);
    if (list) {
      list.cards = list.cards.filter(c => c.toString() !== card._id.toString());
      await list.save();
    }
    await Card.findByIdAndDelete(card._id);
    res.json({ message: 'Card deleted' });
  } catch (err) {
    next(err);
  }
};