import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import type { Session, SessionExercise, ClientExercise } from "types/tableType";
import { ExerciseHistoryCard } from "./ExerciseHistoryCard";
import type { ExerciseGroup } from "./ExerciseHistoryCard";

interface ExerciseHistoryListProps {
  trainingSessions: Session[];
  sessionExercises: SessionExercise[];
  clientExercises: ClientExercise[];
  onAddEntry: () => void;
}

export function ExerciseHistoryList({
  trainingSessions,
  sessionExercises,
  clientExercises,
  onAddEntry,
}: ExerciseHistoryListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const sessionMap = useMemo(() => {
    const map = new Map<string, Session>();
    trainingSessions.forEach((s) => {
      if (s.id) map.set(s.id, s);
    });
    return map;
  }, [trainingSessions]);

  const exerciseNameMap = useMemo(() => {
    const map = new Map<
      string,
      { name: string; category?: string | null; imageUrl?: string | null }
    >();
    clientExercises.forEach((ce) => {
      if (ce.exerciseId && ce.exerciseName) {
        map.set(ce.exerciseId, {
          name: ce.exerciseName,
          category: ce.category,
          imageUrl: ce.imageUrl,
        });
      }
    });
    return map;
  }, [clientExercises]);

  // Group session exercises by exerciseId
  const exerciseGroups = useMemo(() => {
    const groups = new Map<string, ExerciseGroup>();

    sessionExercises.forEach((se) => {
      const session = sessionMap.get(se.trainingSessionId);
      const exerciseInfo = exerciseNameMap.get(se.exerciseId);
      if (!groups.has(se.exerciseId)) {
        groups.set(se.exerciseId, {
          exerciseId: se.exerciseId,
          exerciseName: exerciseInfo?.name ?? "Unknown",
          category: exerciseInfo?.category,
          imageUrl: exerciseInfo?.imageUrl,
          entries: [],
        });
      }
      groups.get(se.exerciseId)!.entries.push({
        sessionExercise: se,
        date: session?.date ?? null,
      });
    });

    // entries by date descending
    groups.forEach((group) => {
      group.entries.sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0;
        const db = b.date ? new Date(b.date).getTime() : 0;
        return db - da;
      });
    });

    return Array.from(groups.values());
  }, [sessionExercises, sessionMap, exerciseNameMap]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return exerciseGroups;
    const q = searchQuery.toLowerCase();
    return exerciseGroups.filter((g) => g.exerciseName.toLowerCase().includes(q));
  }, [exerciseGroups, searchQuery]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Find exercise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-bg/30"
          />
        </div>
        <button
          onClick={onAddEntry}
          className="flex items-center gap-1 bg-primary-bg text-white px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <h2 className="text-lg font-bold text-primary-bg mb-3">Exercises History</h2>

      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
          {searchQuery ? "No exercises match your search" : "No exercise entries yet"}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredGroups.map((group) => (
            <ExerciseHistoryCard key={group.exerciseId} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
