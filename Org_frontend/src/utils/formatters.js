export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatNumber = (num) => {
  return num.toLocaleString();
};

export const formatDifficulty = (difficulty) => {
  const colors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400',
  };
  return colors[difficulty?.toLowerCase()] || 'text-gray-400';
};
