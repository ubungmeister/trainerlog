export const formatDate = (date: string|Date) => {
  if (!date) return;
  const formattedDate = new Date(date);
  return formattedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};
