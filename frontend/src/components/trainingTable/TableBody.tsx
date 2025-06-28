import {
  type Session,
  type SessionExercise,
  type Exercise,
} from "types/tableType";
import { formatDate } from "utils/formatDate";
import { type SessionExerciseTableType } from "components/trainingTable/Table";
import { sessionExerciseStore } from "app/store/trainingTable/sessionExerciseStore";
import { clientExerciseStore } from "app/store/trainingTable/clientExerciseStore";
import { clientExerciseListStore } from "app/store/trainingTable/clientExerciseListStore";
import { useMemo } from "react";
type TableBodyProps = {
  exerciseMap: Record<string, string>;
  exercises: Exercise[];
  visibleDates: Date[];
  trainingSessions: Session[];
  sessionExercises: SessionExercise[];
};

export const TableBody = ({
  exerciseMap,
  visibleDates,
  trainingSessions,
  sessionExercises,
  exercises,
}: TableBodyProps) => {
  // Zustand store for managing session exercises modal state
  const openSessionExerciseModal = sessionExerciseStore(
    (state) => state.openModal,
  );

  //Zustand store for managing client exercises modal state
  const openClientExerciseModal = clientExerciseStore(
    (state) => state.openModal,
  );
  // Zustand store for managing client exercises list
  // This store contains the client exercises and the filter state
  const clientExercises = clientExerciseListStore(
    (state) => state.clientExercises,
  );
  const filterState = clientExerciseListStore((state) => state.filterState);

  const filteredClientExercises = useMemo(() => {
    return clientExercises.filter((ce) => {
      if (filterState === "all") return true;
      if (filterState === "active") return ce.activeClientExercise;
      if (filterState === "inactive") return !ce.activeClientExercise;
      return true;
    });
  }, [clientExercises, filterState]);

  // Exercises IDs retlated to the client exercises
  // This is used to display only the exercises that are related to the client
  const exerciseIds = useMemo(() => {
    return filteredClientExercises
      .map((ce) => ce.exerciseId)
      .filter((id): id is string => typeof id === "string");
  }, [filteredClientExercises]);

  // Update Exercise Name and state
  const handleUpdateSessionExercise = (exerciseId: string) => {
    console.log("Updating session exercise for exerciseId:", exerciseId);
    // find client exercise from clientExercises by exercise id
    const clientExercise = clientExercises.find(
      (ce) => ce.exerciseId === exerciseId,
    );
    if (!clientExercise) {
      console.error("Client exercise not found for exerciseId:", exerciseId);
      return;
    }
    openClientExerciseModal({
      clientExercise: clientExercise,
      exercises: exercises,
    });
  };

  // Creating or updating session exercise
  const sessionExerciseHandler = ({
    cell,
    session,
    exId,
  }: SessionExerciseTableType) => {
    const exercise = exercises.find((e: Exercise) => e.id === exId);
    if (!exercise) {
      console.error("Exercise not found for exId:", exId);
      return;
    }
    openSessionExerciseModal({
      sessionExercise: cell,
      session: session,
      exercise: exercise,
    });
  };

  return (
    <tbody>
      {exerciseIds.map((exId: string) => (
        <tr
          key={exId}
          className="border-b border-primary-button hover:bg-gray-50"
        >
          <td
            onClick={() => handleUpdateSessionExercise(exId)}
            className="sticky left-0 bg-white px-4 py-3 font-medium border-primary-button border-r-1"
          >
            {exerciseMap[exId]}
          </td>
          {visibleDates.map((date) => {
            const session = trainingSessions.find(
              (s: Session) => s.date === date,
            ) as Session;
            const cell = sessionExercises
              ? sessionExercises.find(
                  (se: SessionExercise) =>
                    se.trainingSessionId === session?.id &&
                    se.exerciseId === exId,
                )
              : undefined;
            return (
              <td
                onClick={() => sessionExerciseHandler({ cell, session, exId })}
                key={formatDate(date)}
                className=" px-4 py-3 min-w-[80px] text-center hover:bg-violet-100  active:bg-violet-100 "
              >
                {cell ? (
                  <span className="inline-block bg-primary-button rounded-full px-3 py-1 text-primary-bg text-sm text-center">
                    {cell.weight}×{cell.repetitions}
                  </span>
                ) : (
                  <span className=" text-primary-label font-bold">+</span>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};
