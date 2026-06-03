import { useState, useEffect, useRef } from 'react';

export function useTimer(startedAt, durationMinutes, onExpire) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [percent, setPercent] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!startedAt || !durationMinutes) return;
    const start = new Date(startedAt);
    const totalSeconds = durationMinutes * 60;
    const update = () => {
      const now = new Date();
      const elapsed = (now - start) / 1000;
      const remaining = Math.max(0, totalSeconds - elapsed);
      setTimeLeft(remaining);
      setPercent((elapsed / totalSeconds) * 100);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        onExpire?.();
      }
    };
    update();
    intervalRef.current = setInterval(update, 1000);
    return () => clearInterval(intervalRef.current);
  }, [startedAt, durationMinutes, onExpire]);

  const format = () => {
    if (timeLeft === null) return null;
    const mins = Math.floor(timeLeft / 60);
    const secs = Math.floor(timeLeft % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return { timeLeft, percent, formatted: format() };
}