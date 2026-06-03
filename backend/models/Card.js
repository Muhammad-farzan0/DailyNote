import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const checklistItemSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false }
});

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  labels: [{ type: String }],
  dueDate: { type: Date },
  checklist: [checklistItemSchema],
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  timerDuration: { type: Number, default: 0 },
  timerStartedAt: { type: Date },
  timerExpired: { type: Boolean, default: false },
  status: { type: String, enum: ['todo', 'in-progress', 'done', 'incomplete'], default: 'todo' },
  order: { type: Number, default: 0 }
}, { 
  timestamps: true   // ✅ Adds createdAt AND updatedAt automatically
});

export default mongoose.model('Card', cardSchema);