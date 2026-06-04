import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Clock } from 'lucide-react';

export default function TimerSettings({ cardId, currentDuration }) {
  const [minutes, setMinutes] = useState(currentDuration || 0);
  const [loading, setLoading] = useState(false);

  const setTimer = async () => {
    if (minutes < 0) return;
    setLoading(true);
    try {
      await api.put(`/cards/${cardId}/timer`, { minutes });
      toast.success(`Timer set to ${minutes} minutes`);
    } catch (err) {
      toast.error('Failed to set timer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
  
      <div className="flex gap-2">
        <input type="number" value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value) || 0)} className="w-24 p-2 border rounded dark:bg-gray-700" min="0" step="5" />
        <button onClick={setTimer} disabled={loading} className="bg-gray-200 dark:bg-gray-700 px-3 rounded text-sm">Set</button>
      </div>
    </div>
  );
}