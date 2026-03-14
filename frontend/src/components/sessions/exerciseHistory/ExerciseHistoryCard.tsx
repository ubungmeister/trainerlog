import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { formatDate } from "utils";
import type { SessionExercise } from "types/tableType";

// Placeholder image for exercises without photos
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop";

export interface ExerciseGroup {
  exerciseId: string;
  exerciseName: string;
  category?: string | null;
  imageUrl?: string | null;
  entries: {
    sessionExercise: SessionExercise;
    date: Date | string | null;
  }[];
}

export function ExerciseHistoryCard({ group }: { group: ExerciseGroup }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const lastEntry = group.entries[0];
  const recentEntries = group.entries.slice(0, 3);

  const handleViewMore = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else {
      // TODO: Navigate to exercise detail page
    }
  };

  // Extracted Photo + Stats box to avoid duplication
  const renderPhotoStatsBox = () => (
    <div className="flex rounded-2xl overflow-hidden border border-gray-100">
      <img
        src={group.imageUrl || PLACEHOLDER_IMAGE}
        alt={group.exerciseName}
        className="w-[50%] h-24 object-cover flex-shrink-0"
      />

      <div className="flex-1 flex flex-col justify-center bg-gray-200 px-4 py-2">
        {lastEntry && (
          <div className="text-gray-700">
            <p className="text-base">
              <span className="font-bold">{lastEntry.sessionExercise.sets} sets</span>
              <span className="text-gray-400"> · </span>
              <span className="text-gray-600">{lastEntry.sessionExercise.repetitions} reps</span>
            </p>
            <p className="text-base font-bold">{lastEntry.sessionExercise.weight} kg</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{group.exerciseName}</h3>
          {group.category && <p className="text-sm text-gray-500">{group.category}</p>}
        </div>
        {lastEntry?.date && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center rounded-full overflow-hidden border border-gray-200"
          >
            <span className="bg-primary-bg text-white text-sm font-medium px-3 py-1 whitespace-nowrap">
              {formatDate(lastEntry.date)}
            </span>
            <span className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium px-3 py-1 transition-colors">
              {isExpanded ? "Less" : "More"}
            </span>
          </button>
        )}
      </div>

      {/* Collapsed View */}
      {!isExpanded && (
        <div className="mt-3">
          {renderPhotoStatsBox()}

          {/* View More - outlined button with arrow */}
          <button
            onClick={handleViewMore}
            className="w-full flex justify-center items-center gap-2 rounded-full py-3 mt-3 bg-gray-50 border border-primary-bg hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <span className="text-sm text-primary-bg font-semibold">View More</span>
            <ChevronRight size={18} className="text-primary-bg" />
          </button>
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="mt-3">
          {renderPhotoStatsBox()}

          <div className="space-y-2 mt-4 mb-4">
            {recentEntries.map((entry, idx) => (
              <div
                key={entry.sessionExercise.id ?? idx}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  {idx === 0 ? (
                    <span className="bg-primary-bg text-white text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      {entry.date ? formatDate(entry.date) : "N/A"}
                      <ChevronRight size={14} />
                    </span>
                  ) : (
                    <span className="text-gray-700 font-medium text-sm pl-1">
                      {entry.date ? formatDate(entry.date) : "N/A"}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {entry.sessionExercise.repetitions} reps @ {entry.sessionExercise.weight} kg
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={handleViewMore}
            className="w-full bg-primary-bg text-white py-3 rounded-full font-medium flex items-center justify-center gap-1"
          >
            All History
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
