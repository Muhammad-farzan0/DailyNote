import axios from 'axios';
import FormData from 'form-data';
import Card from '../models/Card.js';
import Board from '../models/Board.js';

export const uploadAttachment = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    const board = await Board.findById(card.board);
    if (!board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const formData = new FormData();
    formData.append('image', base64Image);
    formData.append('name', req.file.originalname);

    // ✅ Use your ImgBB API key from environment variables
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error('IMGBB_API_KEY is not set in environment');
    }

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: formData.getHeaders(),
      params: { key: apiKey }
    });

    const imageUrl = response.data.data?.url || response.data.data?.display_url;
    if (!imageUrl) {
      console.error('ImgBB response:', response.data);
      return res.status(500).json({ message: 'Failed to get image URL from ImgBB' });
    }

    const attachment = {
      url: imageUrl,
      filename: req.file.originalname,
      uploadedAt: new Date()
    };
    card.attachments.push(attachment);
    await card.save();
    res.json({ attachment });
  } catch (err) {
    console.error('Upload error:', err.message);
    if (err.response) console.error('ImgBB response error:', err.response.data);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

export const deleteAttachment = async (req, res, next) => {
  try {
    const { cardId, publicId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    const board = await Board.findById(card.board);
    if (!board.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // For ImgBB, we cannot delete the remote file; just remove reference from DB
    card.attachments = card.attachments.filter(a => a.url !== publicId);
    await card.save();
    res.json({ message: 'Attachment removed from card' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};