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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., Write a checklist for..."
        className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 text-sm"
      />
      <button
        onClick={generate}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition shadow-sm"
      >
        {loading ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />}
        Generate
      </button>
    </div>
  );
}