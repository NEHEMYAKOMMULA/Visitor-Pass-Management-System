export function validateVisitDateTime(visitDate, arrivalTime) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(visitDate)) return "Visit date must be YYYY-MM-DD";
  if (!/^\d{2}:\d{2}$/.test(arrivalTime)) return "Arrival time must be HH:mm";

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  if (visitDate < today) return "Visit date cannot be earlier than the current date";

  if (visitDate === today) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [h, m] = arrivalTime.split(":").map(Number);
    if (h * 60 + m < currentMinutes) return "Today's expected arrival time cannot be earlier than the current time";
  }
  return null;
}
