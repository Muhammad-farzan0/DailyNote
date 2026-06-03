import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
  order: { type: Number, default: 0 }
});

export default mongoose.model('List', listSchema);