import { useEffect, useState } from 'react';

export default function Countdown({ startedAt, durationMinutes }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!startedAt || !durationMinutes) return;
    const interval = setInterval(() => {
      const start = new Date(startedAt);
      const now = new Date();
      const elapsed = (now - start) / 1000;
      const totalSeconds = durationMinutes * 60;
      const left = Math.max(0, totalSeconds - elapsed);
      const mins = Math.floor(left / 60);
      const secs = Math.floor(left % 60);
      setTimeLeft(`${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`);
      if (left <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt, durationMinutes]);

  if (!timeLeft) return null;
  const isLow = parseInt(timeLeft.split(':')[0]) < 1;

  return <span className={`text-xs font-mono ${isLow ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>{timeLeft}</span>;
}