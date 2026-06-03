import Board from '../models/Board.js';
import List from '../models/List.js';
import ActivityLog from '../models/ActivityLog.js';

// Create a board
export const createBoard = async (req, res, next) => {
  try {
    const { name } = req.body;
    const board = await Board.create({ name, owner: req.user._id, members: [req.user._id] });
    const defaultLists = ['To Do', 'In Progress', 'Completed', 'Incomplete'];
    for (let i = 0; i < defaultLists.length; i++) {
      const list = await List.create({ title: defaultLists[i], board: board._id, order: i });
      board.lists.push(list._id);
    }
    await board.save();
    const populatedBoard = await Board.findById(board._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');
    res.status(201).json(populatedBoard);
  } catch (err) {
    next(err);
  }
};

// Get all boards for user
export const getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({ members: req.user._id })
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');
    res.json(boards);
  } catch (err) {
    next(err);
  }
};

// Get single board with lists, cards, and populated owner & members
export const getBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .populate({
        path: 'lists',
        populate: { 
          path: 'cards', 
          populate: { 
            path: 'assignees comments.user', 
            select: 'name avatar' 
          }
        }
      });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (!board.members.some(m => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(board);
  } catch (err) {
    next(err);
  }
};

// Update board name (owner only)
export const updateBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can edit board' });
    }
    board.name = req.body.name || board.name;
    await board.save();
    const updatedBoard = await Board.findById(board._id).populate('owner', 'name email avatar');
    res.json(updatedBoard);
  } catch (err) {
    next(err);
  }
};

// Delete board (owner only)
export const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can delete board' });
    }
    await Board.findByIdAndDelete(board._id);
    res.json({ message: 'Board deleted' });
  } catch (err) {
    next(err);
  }
};

// Add member (owner only)
export const addMember = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can add members' });
    }
    const { userId } = req.body;
    if (board.members.includes(userId)) {
      return res.status(400).json({ message: 'User already a member' });
    }
    board.members.push(userId);
    await board.save();
    await ActivityLog.create({
      user: req.user._id,
      board: board._id,
      action: 'added_member',
      details: { userId }
    });
    const updatedBoard = await Board.findById(board._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');
    res.json(updatedBoard);
  } catch (err) {
    next(err);
  }
};

// Remove member (owner only)
export const removeMember = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can remove members' });
    }
    const { userId } = req.body;
    if (userId === board.owner.toString()) {
      return res.status(400).json({ message: 'Cannot remove owner' });
    }
    board.members = board.members.filter(m => m.toString() !== userId);
    await board.save();
    await ActivityLog.create({
      user: req.user._id,
      board: board._id,
      action: 'removed_member',
      details: { userId }
    });
    const updatedBoard = await Board.findById(board._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');
    res.json(updatedBoard);
  } catch (err) {
    next(err);
  }
};