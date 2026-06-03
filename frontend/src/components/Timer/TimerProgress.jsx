import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function TimerProgress({ card }) {
  const [percent, setPercent] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!card.timerStartedAt || card.status !== 'in-progress' || !card.timerDuration) return;
    const interval = setInterval(() => {
      const started = new Date(card.timerStartedAt);
      const now = new Date();
      const elapsed = (now - started) / 60000; // minutes
      const total = card.timerDuration;
      const left = Math.max(0, total - elapsed);
      setRemaining(left);
      setPercent(Math.min(100, (elapsed / total) * 100));
      if (left <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [card]);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  if (!card.timerDuration || card.status !== 'in-progress') return null;

  return (
    <div className="relative w-8 h-8">
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <circle cx="25" cy="25" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <motion.circle
          cx="25" cy="25" r={radius} fill="none" stroke="#3b82f6" strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 25 25)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-blue-600">
        {Math.ceil(remaining)}m
      </div>
    </div>
  );
}