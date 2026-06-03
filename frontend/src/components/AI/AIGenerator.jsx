import { useState } from 'react';
import api from '../../services/api';
import { Sparkles, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIGenerator({ onGenerate }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/ai/generate-description', { prompt });
      onGenerate(res.data.text);
      setPrompt('');
    } catch (err) {
      toast.error('AI generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Create a detailed description for: fix login bug"
          className="flex-1 p-2 border rounded dark:bg-gray-800 text-sm"
        />
        <button onClick={generate} disabled={loading} className="bg-purple-600 text-white px-3 rounded flex items-center gap-1">
          {loading ? <Loader size={14} className="animate-spin" /> : <Sparkles size={14} />}
          Generate
        </button>
      </div>
    </div>
  );
}