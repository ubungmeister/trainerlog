import { ChevronRight } from "lucide-react";
import { formatDate } from "utils/formatDate";
import type { Session, SessionExercise } from "types/tableType";

export interface SessionGroup {
  session: Session;
  exercises: SessionExercise[];
}

export function SessionCard({
  group,
  isToday,
}: {
  group: SessionGroup;
  isToday: boolean;
}) {
  const MAX_TAGS = 4;
  const visibleExercises = group.exercises.slice(0, MAX_TAGS);
  const remainingCount = group.exercises.length - MAX_TAGS;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="mb-2">
        <h3 className="font-bold text-gray-900">
          {group.session.date ? formatDate(group.session.date) : "N/A"}
          {isToday && " (Today)"}
        </h3>
        <p className="text-sm text-gray-500">
          {group.exercises.length} exercises logged
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {visibleExercises.map((se, idx) => (
          <span
            key={se.id ?? idx}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              idx === 0
                ? "bg-primary-bg text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {se.exerciseName ?? "Exercise"}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            ...
          </span>
        )}
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-1 text-sm text-primary-bg font-medium">
          View Exercises <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
