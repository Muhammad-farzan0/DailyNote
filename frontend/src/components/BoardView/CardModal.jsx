import { useState, useEffect } from 'react';
import { X, Save, Clock, Users, Calendar, CheckSquare, Trash2, MessageSquare, Tag, Plus, Paperclip, File } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import TimerSettings from '../Timer/TimerSettings';
import AIGenerator from '../AI/AIGenerator';
import { format } from 'date-fns';
import { useBoard } from '../../context/BoardContext';
import { motion, AnimatePresence } from 'framer-motion';

const LABEL_OPTIONS = [
  { name: 'bug', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  { name: 'feature', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  { name: 'enhancement', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { name: 'urgent', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  { name: 'documentation', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  { name: 'question', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
];

export default function CardModal({ card, isOpen, onClose }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.dueDate ? format(new Date(card.dueDate), 'yyyy-MM-dd') : '');
  const [checklist, setChecklist] = useState(card.checklist || []);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(card.comments || []);
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState(card.labels || []);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [attachments, setAttachments] = useState(card.attachments || []);
  const [uploading, setUploading] = useState(false);
  
  // Assignees state
  const [assignees, setAssignees] = useState(card.assignees || []);
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [assigneeResults, setAssigneeResults] = useState([]);
  
  const { refresh } = useBoard();

  // Search users by email
  const searchUsers = async (email) => {
    if (email.length < 2) return;
    try {
      const res = await api.get(`/users/search?email=${email}`);
      const existingIds = assignees.map(a => a._id);
      const filtered = res.data.filter(u => !existingIds.includes(u._id));
      setAssigneeResults(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => searchUsers(assigneeSearch), 300);
    return () => clearTimeout(delay);
  }, [assigneeSearch]);

  const addAssignee = (user) => {
    setAssignees([...assignees, user]);
    setAssigneeSearch('');
    setAssigneeResults([]);
  };

  const removeAssignee = (userId) => {
    setAssignees(assignees.filter(a => a._id !== userId));
  };

  useEffect(() => {
    if (isOpen) {
      setTitle(card.title);
      setDescription(card.description || '');
      setDueDate(card.dueDate ? format(new Date(card.dueDate), 'yyyy-MM-dd') : '');
      setChecklist(card.checklist || []);
      setComments(card.comments || []);
      setLabels(card.labels || []);
      setAttachments(card.attachments || []);
      setAssignees(card.assignees || []);
    }
  }, [isOpen, card]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/cards/${card._id}`, {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignees: assignees.map(a => a._id),
        checklist,
        labels,
      });
      toast.success('Card updated');
      refresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this card? This action cannot be undone.')) return;
    try {
      await api.delete(`/cards/${card._id}`);
      toast.success('Card deleted');
      refresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/cards/${card._id}/comments`, { text: newComment });
      setNewComment('');
      refresh();
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const toggleLabel = (labelName) => {
    if (labels.includes(labelName)) {
      setLabels(labels.filter(l => l !== labelName));
    } else {
      setLabels([...labels, labelName]);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const res = await api.post(`/api/cards/${card._id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAttachments([...attachments, res.data.attachment]);
      toast.success('File uploaded');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteAttachment = async (publicId) => {
    if (!window.confirm('Delete this attachment?')) return;
    try {
      await api.delete(`/api/cards/${card._id}/attachments/${publicId}`);
      setAttachments(attachments.filter(a => a.public_id !== publicId));
      toast.success('Attachment deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Card</h2>
              <div className="flex gap-2">
                <button onClick={handleDelete} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition" title="Delete Card">
                  <Trash2 size={18} />
                </button>
                <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none pb-1"
                placeholder="Card title"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="Write a detailed description..."
                />
              </div>

              {/* Labels */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Tag size={16} /> Labels
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {labels.map(label => {
                    const option = LABEL_OPTIONS.find(opt => opt.name === label);
                    return (
                      <span key={label} className={`px-2 py-1 rounded-full text-xs font-medium ${option?.color || 'bg-gray-100 text-gray-800'}`}>
                        {label}
                        <button onClick={() => toggleLabel(label)} className="ml-1 hover:text-red-500">×</button>
                      </span>
                    );
                  })}
                  <button onClick={() => setShowLabelPicker(!showLabelPicker)} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200">
                    <Plus size={12} /> Add label
                  </button>
                </div>
                {showLabelPicker && (
                  <div className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 flex flex-wrap gap-2">
                    {LABEL_OPTIONS.map(opt => (
                      <button key={opt.name} onClick={() => { toggleLabel(opt.name); setShowLabelPicker(false); }} className={`px-2 py-1 rounded-full text-xs font-medium ${opt.color}`}>
                        {opt.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><Calendar size={16} /> Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-gray-700" />
                </div>
                <TimerSettings cardId={card._id} currentDuration={card.timerDuration} />
              </div>

              {/* Assignees by email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Users size={16} /> Assignees (search by email)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={assigneeSearch}
                    onChange={(e) => setAssigneeSearch(e.target.value)}
                    placeholder="Search user by email..."
                    className="w-full p-2 border rounded-lg dark:bg-gray-700"
                  />
                  {assigneeSearch && assigneeResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {assigneeResults.map(user => (
                        <div key={user._id} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2" onClick={() => addAssignee(user)}>
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">{user.name.charAt(0)}</div>
                          <div><div className="text-sm font-medium">{user.name}</div><div className="text-xs text-gray-500">{user.email}</div></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {assignees.map(assignee => (
                    <div key={assignee._id} className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 rounded-full px-2 py-1 text-sm">
                      {assignee.name}
                      <button onClick={() => removeAssignee(assignee._id)} className="ml-1 text-red-500">&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Paperclip size={16} /> Attachments</label>
                <div className="space-y-2">
                  {attachments.map(att => (
                    <div key={att.public_id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-2 truncate">
                        <File size={16} className="text-blue-500" />
                        <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate">
                          {att.filename}
                        </a>
                      </div>
                      <button onClick={() => deleteAttachment(att.public_id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">
                      <Plus size={16} /> Upload file
                      <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                    </label>
                    {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><CheckSquare size={16} /> Checklist</label>
                <div className="space-y-2">
                  {checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input type="checkbox" checked={item.completed} onChange={() => {
                        const newList = [...checklist];
                        newList[idx].completed = !newList[idx].completed;
                        setChecklist(newList);
                      }} className="w-4 h-4" />
                      <input value={item.text} onChange={(e) => {
                        const newList = [...checklist];
                        newList[idx].text = e.target.value;
                        setChecklist(newList);
                      }} className="flex-1 p-2 border rounded-lg dark:bg-gray-700" />
                      <button onClick={() => setChecklist(checklist.filter((_, i) => i !== idx))} className="text-red-500">✖</button>
                    </div>
                  ))}
                  <button onClick={() => setChecklist([...checklist, { text: '', completed: false }])} className="text-blue-600 text-sm">+ Add item</button>
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><MessageSquare size={16} /> Comments</label>
                <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2 mb-2">
                  {comments.length === 0 && <p className="text-gray-400 text-sm">No comments yet.</p>}
                  {comments.map((c, i) => (
                    <div key={i} className="text-sm border-b pb-1"><span className="font-semibold">{c.user?.name || 'User'}:</span> {c.text}</div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="flex-1 p-2 border rounded-lg dark:bg-gray-700" />
                  <button onClick={addComment} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Post</button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">AI Assistant</label>
                <AIGenerator onGenerate={(text) => setDescription(prev => prev + '\n\n' + text)} />
              </div>
            </div>

            <div className="border-t px-6 py-4 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}