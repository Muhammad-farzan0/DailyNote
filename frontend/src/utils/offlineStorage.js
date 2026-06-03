// Simple localStorage wrapper for offline mode
export const saveOffline = (key, data) => {
  try {
    localStorage.setItem(`offline_${key}`, JSON.stringify(data));
  } catch (e) {}
};

export const loadOffline = (key) => {
  try {
    const data = localStorage.getItem(`offline_${key}`);
    return data ? JSON.parse(data) : null;
  } catch (e) { return null; }
};

export const clearOffline = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('offline_')) localStorage.removeItem(key);
  });
};