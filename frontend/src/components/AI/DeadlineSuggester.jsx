import { useState } from 'react';
import api from '../../services/api';
import { Calendar, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeadlineSuggester({ title, onSuggest }) {
  const [loading, setLoading] = useState(false);

  const suggest = async () => {
    if (!title) return toast.error('Enter a title first');
    setLoading(true);
    try {
      const res = await api.post('/ai/suggest-deadline', { title });
      const date = new Date(res.data.suggestedDueDate);
      onSuggest(date);
    } catch (err) {
      toast.error('Could not suggest deadline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={suggest} disabled={loading} className="text-xs text-purple-600 flex items-center gap-1">
      {loading ? <Sparkles size={12} className="animate-spin" /> : <Calendar size={12} />}
      Suggest deadline
    </button>
  );
}