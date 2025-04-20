export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();

  // Check if it's today
  if (date.toDateString() === now.toDateString()) {
    return "Today, " + formatTime(date);
  }

  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday, " + formatTime(date);
  }

  // Otherwise, show full date
  return `${date.toLocaleDateString()} ${formatTime(date)}`;
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
