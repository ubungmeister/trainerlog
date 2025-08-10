import { type Session } from "types/tableType";

export const sortSessionsByDate = (trainingSessions: Session[]) =>
  trainingSessions
    ? [...trainingSessions].sort((a, b) => {
        return (
          new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
        );
      })
    : [];

export const getSessionDates = (sortedSessions: Session[]) =>
  sortedSessions
    .filter((s) => s.date) // Filter out sessions without dates
    .map((s: Session) => new Date(s.date as Date));
