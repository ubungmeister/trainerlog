import { ChevronRight } from "lucide-react";
import { formatDate } from "utils";
import type { SessionExercise } from "types/tableType";

export interface ExerciseGroup {
  exerciseId: string;
  exerciseName: string;
  entries: {
    sessionExercise: SessionExercise;
    date: Date | string | null;
  }[];
}

export function ExerciseHistoryCard({ group }: { group: ExerciseGroup }) {
  const recentEntries = group.entries.slice(0, 4);
  const lastEntry = group.entries[0];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">{group.exerciseName}</h3>
        <button className="flex items-center gap-1 text-sm text-primary-bg font-medium">
          View All <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {recentEntries.map((entry, idx) => (
          <span
            key={entry.sessionExercise.id ?? idx}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              idx === 0 ? "bg-primary-bg text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {entry.date ? formatDate(entry.date) : "N/A"}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {recentEntries.map((entry, idx) => (
          <span
            key={entry.sessionExercise.id ?? idx}
            className="px-3 py-1 bg-gray-50 rounded-lg text-xs text-gray-700"
          >
            <span className="font-semibold">{entry.sessionExercise.repetitions}</span> rep |{" "}
            <span className="font-semibold">{entry.sessionExercise.sets}</span> set |{" "}
            <span className="font-semibold">{entry.sessionExercise.weight}</span> kg
            {idx < recentEntries.length - 1 && recentEntries.length > 2 && " ..."}
          </span>
        ))}
      </div>

      {lastEntry && (
        <p className="text-xs text-gray-500">
          Last: {lastEntry.sessionExercise.repetitions} × {lastEntry.sessionExercise.sets} @{" "}
          {lastEntry.sessionExercise.weight} kg
          {lastEntry.date && ` (${formatDate(lastEntry.date)})`}
        </p>
      )}
    </div>
  );
}
