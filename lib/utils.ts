
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const getDaysRemaining = (targetDate: number): number => {
  const diff = targetDate - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const REVISION_INTERVAL_DAYS = 5;

export const generateId = () => Math.random().toString(36).substring(2, 9);
