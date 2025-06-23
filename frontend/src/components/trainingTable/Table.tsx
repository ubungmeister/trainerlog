import { useEffect, useRef } from "react";
import { useTrainingTableData } from "hooks/trainingTable/useTrainingTableData";
import {
  type Exercise,
  type ClientExercise,
  type Session,
  type SessionExercise,
} from "types/tableType";
import { sessionExerciseStore } from "app/store/trainingTable/sessionExerciseStore";
import { trainingSessionStore } from "app/store/trainingTable/trainingSessionStore";
import { TableHeader } from "components/trainingTable/TableHeader";
import { TableBody } from "components/trainingTable/TableBody";
import { TableActions } from "components/trainingTable/TableActions";

type TableProps = {
  clientId: string;
};

export type SessionExerciseTableType = {
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

  // Zustand store for managing session exercises modal state
  const openSessionExerciseModal = sessionExerciseStore(
    (state) => state.openModal,
  );
  //Zustand store for managing training session modal state
  const openTrainingSessionModal = trainingSessionStore(
    (state) => state.openModal,
  );

  const scrollRef = useRef<HTMLDivElement>(null);

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

  const visibleDates = [...dates.slice(-5)];

  const exerciseIds = clientExercises
    ? clientExercises.map((ce: ClientExercise) => ce.exerciseId)
    : [];

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  // Function to handle updating a training session, called when a date in the header is clicked
  const handleUpdateTrainingSession = (date: Date) => {
    const session = trainingSessions.find(
      (s: Session) => s.date.getTime() === date.getTime(),
    );
    if (session) {
      openTrainingSessionModal({ session: session });
    } else {
      console.error("Session not found for date:", date);
    }
  };

  // Updating a session exercise, function is called when a cell in the table is clicked
  const sessionExerciseHandler = ({
    cell,
    session,
    exId,
  }: SessionExerciseTableType) => {
    const exercise = exercises.find((e: Exercise) => e.id === exId);
    openSessionExerciseModal({
      sessionExercise: cell,
      session: session,
      exercise: exercise,
    });
  };

  return (
    <div className="flex flex-col md:items-center items-start justify-center p-4 ">
      <h2 className="text-2xl font-bold text-white mb-6">Training Table</h2>
      <TableActions scrollRef={scrollRef} />

      <div className="w-full max-w-5xl relative overflow-hidden rounded-lg ">
        <div className="overflow-x-auto" ref={scrollRef}>
          <table className="min-w-max bg-white border-collapse mx-auto shadow-lg">
            <TableHeader
              visibleDates={visibleDates}
              onDateClick={handleUpdateTrainingSession}
            />
            <TableBody
              exerciseIds={exerciseIds}
              exerciseMap={exerciseMap}
              visibleDates={visibleDates}
              trainingSessions={sortedSessions}
              sessionExercises={sessionExercises}
              onCellClick={sessionExerciseHandler}
            />
          </table>
        </div>
      </div>
    </div>
  );
};
