import { useEffect, useRef } from "react";
import { useTrainingTableData } from "hooks/trainingTable/useTrainingTableData";
import { type Session, type SessionExercise } from "types/tableType";
import { TableHeader } from "components/trainingTable/TableHeader";
import { TableBody } from "components/trainingTable/TableBody";
import { TableActions } from "components/trainingTable/TableActions";
import { clientExerciseListStore } from "app/store/trainingTable/clientExerciseListStore";
type TableProps = {
  clientId: string;
};

export type SessionExerciseTableType = {
  cell: SessionExercise | undefined;
  session: Session;
  exId: string;
};

export const Table = ({ clientId }: TableProps) => {
  const setClientExercises = clientExerciseListStore(
    (state) => state.setClientExercises,
  );

  const {
    isLoading,
    trainingSessions,
    clientExercises,
    exercises,
    sessionExercises,
  } = useTrainingTableData(clientId || "");

  useEffect(() => {
    setClientExercises(clientExercises || []);
  }, [clientExercises]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [trainingSessions]);

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

  const visibleDates = [...dates.slice(-5)];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:items-center items-start justify-center p-4 ">
      <h2 className="text-3xl font-bold text-primaty-text mb-3">
        Training Table
      </h2>
      <TableActions scrollRef={scrollRef} />

      <div className="w-full relative overflow-hidden rounded-lg border-1 border-primary-button">
        <div className="overflow-x-auto" ref={scrollRef}>
          <table className="w-full bg-white  shadow-lg">
            <TableHeader
              visibleDates={visibleDates}
              trainingSessions={trainingSessions}
            />
            <TableBody
              exercises={exercises}
              visibleDates={visibleDates}
              trainingSessions={sortedSessions}
              sessionExercises={sessionExercises}
            />
          </table>
        </div>
      </div>
    </div>
  );
};
