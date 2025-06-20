import { useEffect, useRef } from "react";
import { useTrainingTableData } from "hooks/trainingTable/useTrainingTableData";
import {
  type Exercise,
  type ClientExercise,
  type Session,
  type SessionExercise,
} from "types/tableType";
import { sessionExerciseModalStore } from "app/store/trainingTable/sessionExerciseModalStore";

type TableProps = {
  clientId: string;
};

type SessionExerciseHandlerProps = {
  cell: SessionExercise | undefined;
  session: Session;
  exId: string;
};

export const Table = ({ clientId }: TableProps) => {
  const {
    isLoading,
    trainingSessions,
    clientExercises,
    exercises,
    sessionExercises,
  } = useTrainingTableData(clientId || "");

  const openModal = sessionExerciseModalStore((state) => state.openModal);

  const scrollRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [trainingSessions]);

  const exerciseMap = exercises
    ? Object.fromEntries(exercises.map((e: Exercise) => [e.id, e.name]))
    : {};
  // Sort sessions by date
  const sortedSessions = trainingSessions
    ? [...trainingSessions].sort((a, b) => {
        return (
          new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
        );
      })
    : [];
  //Retrieve the last 5 sessions and add a "new" date
  const dates = sortedSessions.map((s: Session) => s.date);

  const visibleDates = [...dates.slice(-5), "new"];
  const exerciseIds = clientExercises
    ? clientExercises.map((ce: ClientExercise) => ce.exerciseId)
    : [];

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  const sessionExerciseHandler = ({
    cell,
    session,
    exId,
  }: SessionExerciseHandlerProps) => {
    console.log("Session Exercise Clicked", cell, session, exId);
    const exercise = exercises.find((e: Exercise) => e.id === exId);
    openModal({
      sessionExercise: cell,
      session: session,
      exercise: exercise,
    });
  };
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Training Table</h2>
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <div className="overflow-x-auto" ref={scrollRef}>
          <table className="min-w-max bg-white border-collapse">
            <thead>
              <tr className="bg-[var(--color-primary-menu)] text-white">
                <th className=" left-0 z-20 bg-[var(--color-primary-menu)] px-4 py-3 text-left min-w-[120px]">
                  Exercise
                </th>
                {visibleDates.map((date) => (
                  <th
                    key={date}
                    className="px-4 py-3 text-left whitespace-nowrap min-w-[80px]"
                  >
                    {date === "new" ? "+" : formatDate(date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exerciseIds.map((exId: string) => (
                <tr
                  key={exId}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="sticky left-0 bg-white px-4 py-3 font-medium">
                    {exerciseMap[exId]}
                  </td>
                  {visibleDates.map((date) => {
                    if (date === "new") {
                      return (
                        <td
                          key="new"
                          className="px-4 py-3 text-center text-gray-400"
                        >
                          +
                        </td>
                      );
                    }
                    const session = trainingSessions.find(
                      (s: Session) => s.date === date,
                    );
                    const cell = sessionExercises
                      ? sessionExercises.find(
                          (se: SessionExercise) =>
                            se.trainingSessionId === session?.id &&
                            se.exerciseId === exId,
                        )
                      : [];
                    return (
                      <td
                        onClick={() =>
                          sessionExerciseHandler({ cell, session, exId })
                        }
                        key={date}
                        className=" px-4 py-3 min-w-[80px] text-center hover:bg-violet-100  active:bg-violet-100 "
                      >
                        {cell ? (
                          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-center">
                            {cell.weight}×{cell.repetitions}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
