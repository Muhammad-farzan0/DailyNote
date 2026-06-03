import List from '../models/List.js';
import Board from '../models/Board.js';
import Card from '../models/Card.js';

// Create list
export const createList = async (req, res, next) => {
  try {
    const { title, boardId } = req.body;
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (!board.members.includes(req.user._id)) return res.status(403).json({ message: 'Not authorized' });
    const order = board.lists.length;
    const list = await List.create({ title, board: boardId, order });
    board.lists.push(list._id);
    await board.save();
    res.status(201).json(list);
  } catch (err) {
    next(err);
  }
};

// Update list (title or order)
export const updateList = async (req, res, next) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });
    const board = await Board.findById(list.board);
    if (!board.members.includes(req.user._id)) return res.status(403).json({ message: 'Not authorized' });
    list.title = req.body.title || list.title;
    list.order = req.body.order ?? list.order;
    await list.save();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const deleteList = async (req, res, next) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });
    const board = await Board.findById(list.board);
    if (!board.members.includes(req.user._id)) return res.status(403).json({ message: 'Not authorized' });
    
    // Delete all cards in this list
    await Card.deleteMany({ list: list._id });
    await List.findByIdAndDelete(list._id);
    
    // Remove list from board's lists array
    board.lists = board.lists.filter(l => l.toString() !== list._id.toString());
    await board.save();
    
    res.json({ message: 'List deleted' });
  } catch (err) {
    next(err);
  }
};