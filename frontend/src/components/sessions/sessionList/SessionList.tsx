import { useMemo } from "react";
import { Plus } from "lucide-react";
import { formatDate } from "utils/formatDate";
import type { Session, SessionExercise } from "types/tableType";
import { SessionCard } from "./SessionCard";

interface SessionListProps {
  trainingSessions: Session[];
  sessionExercises: SessionExercise[];
  onAddEntry: () => void;
}

export function SessionList({
  trainingSessions,
  sessionExercises,
  onAddEntry,
}: SessionListProps) {
  const sessionExerciseMap = useMemo(() => {
    const map = new Map<string, SessionExercise[]>();
    sessionExercises.forEach((se) => {
      const list = map.get(se.trainingSessionId) ?? [];
      list.push(se);
      map.set(se.trainingSessionId, list);
    });
    return map;
  }, [sessionExercises]);

  const sessionGroups = useMemo(() => {
    const groups = trainingSessions.map((session) => ({
      session,
      exercises: session.id ? (sessionExerciseMap.get(session.id) ?? []) : [],
    }));

    groups.sort((a, b) => {
      const da = a.session.date ? new Date(a.session.date).getTime() : 0;
      const db = b.session.date ? new Date(b.session.date).getTime() : 0;
      return db - da;
    });

    return groups;
  }, [trainingSessions, sessionExerciseMap]);

  const isToday = (date: Date | string | null) => {
    if (!date) return false;
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const lastSession = sessionGroups[0];

  return (
    <div>
      {lastSession && (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Last session:</span>{" "}
            {lastSession.session.date
              ? formatDate(lastSession.session.date)
              : "N/A"}{" "}
            — {lastSession.exercises.length} exercises
          </div>
          <button
            onClick={onAddEntry}
            className="bg-primary-bg text-white px-4 py-2 rounded-xl text-xs font-medium"
          >
            Continue today
          </button>
        </div>
      )}

      {sessionGroups.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
          No sessions yet. Add your first entry!
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessionGroups.map((group) => (
            <SessionCard
              key={group.session.id}
              group={group}
              isToday={isToday(group.session.date)}
            />
          ))}
        </div>
      )}

      <div className="fixed bottom-20 right-4 max-w-lg z-40">
        <button
          onClick={onAddEntry}
          className="bg-primary-bg text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-bg/90 transition-colors"
        >
          <Plus size={28} />
        </button>
      </div>
    </div>
  );
}
