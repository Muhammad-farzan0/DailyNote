export const minutesToMs = (minutes) => minutes * 60 * 1000;
export const msToMinutes = (ms) => Math.floor(ms / 60000);
export const formatCountdown = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};