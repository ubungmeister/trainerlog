import {
  type Session,
  type SessionExercise,
  type Exercise,
  type ClientExercise,
  type Category,
} from "types/tableType";
import { formatDate } from "utils/formatDate";
import { type SessionExerciseTableType } from "components/trainingTable/Table";
import { sessionExerciseStore } from "app/store/trainingTable/sessionExerciseStore";
import { clientExerciseStore } from "app/store/trainingTable/clientExerciseStore";
import { clientExerciseListStore } from "app/store/trainingTable/clientExerciseListStore";
import { useMemo } from "react";
type TableBodyProps = {
  exercises: Exercise[];
  visibleDates: Date[];
  trainingSessions: Session[];
  sessionExercises: SessionExercise[];
  categories: Category[] | null;
};

export const TableBody = ({
  visibleDates,
  trainingSessions,
  sessionExercises,
  exercises,
  categories,
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

  // Update Exercise Name and state
  const handleUpdateSessionExercise = (exerciseId: string) => {
    // find client exercise from clientExercises by exercise id
    const clientExercise = clientExercises.find(
      (ce) => ce.exerciseId === exerciseId,
    );
    if (!clientExercise) {
      console.error("Client exercise not found for exerciseId:", exerciseId);
      return;
    }

    const exercise = exercises.find((e: Exercise) => e.id === exerciseId);
    console.log("Exercise found:", exercise);

    const category = categories?.find(
      (c: Category) => c.name === exercise?.category,
    );
    
    openClientExerciseModal({
      clientExercise: clientExercise,
      exercises: exercises,
      categories: categories,
      category: category || null,
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

  if (filteredClientExercises.length === 0) {
    return (
      <tbody>
        <tr className="border-b border-primary-button hover:bg-gray-50">
          <td
            onClick={() =>
              openClientExerciseModal({
                clientExercise: null,
                exercises: exercises,
                categories: categories,
                category: null,
              })
            }
            colSpan={visibleDates.length + 1}
            className="sticky left-0 bg-white px-4 py-3 font-medium border-primary-button border-r-1"
          >
            Add +
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {filteredClientExercises.map((exercise: ClientExercise) => (
        <tr
          key={exercise.id}
          className="border-b border-primary-button hover:bg-gray-50"
        >
          <td
            onClick={() =>
              handleUpdateSessionExercise(exercise.exerciseId || "")
            }
            className="sticky left-0 bg-white px-4 py-3 font-medium border-primary-button border-r-1"
          >
            {exercise.exerciseName}
          </td>

          {visibleDates.map((date) => {
            const session = trainingSessions.find(
              (s: Session) => s.date === date,
            ) as Session;
            const cell = sessionExercises
              ? sessionExercises.find(
                  (se: SessionExercise) =>
                    se.trainingSessionId === session?.id &&
                    se.exerciseId === exercise.exerciseId,
                )
              : undefined;
            if (!cell && !session) {
              return (
                <td className="px-4 py-3 min-w-[80px] text-center hover:bg-violet-100 active:bg-violet-100">
                  <span className=""></span>
                </td>
              );
            }
            return (
              <td
                onClick={() =>
                  sessionExerciseHandler({
                    cell,
                    session,
                    exId: exercise.exerciseId || "",
                  })
                }
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
