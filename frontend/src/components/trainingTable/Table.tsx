import { useEffect, useRef, useMemo } from "react";
import { useTrainingTableData } from "hooks/trainingTable/useTrainingTableData";
import { type Session, type SessionExercise } from "types/tableType";
import { TableHeader } from "components/trainingTable/TableHeader";
import { TableBody } from "components/trainingTable/TableBody";
import { TableActions } from "components/trainingTable/TableActions";
import { clientExerciseListStore } from "app/store/trainingTable/clientExerciseListStore";
import { TableControls } from "components/trainingTable/TableControls";
import { DataLoading } from "components/ui/DataLoading";
import { useDateWindow } from "hooks/trainingTable/useDateWindow";
import { sortSessionsByDate, getSessionDates } from "utils/sortedSessions";
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
    categories,
  } = useTrainingTableData(clientId || "");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setClientExercises(clientExercises || []);
  }, [clientExercises]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [trainingSessions]);

  //Stable, memoized data transforms
  const sortedSessions = useMemo(
    () => sortSessionsByDate(trainingSessions ?? []),
    [trainingSessions],
  );
  const dates = useMemo(
    () => getSessionDates(sortedSessions),
    [sortedSessions],
  );

  //Windowing via hook
  const {
    visibleDates,
    canPrev,
    canNext,
    showPrev,
    showNext,
    endIndex,
    startIndex,
  } = useDateWindow(dates, 5, 1);

  if (isLoading) {
    return <DataLoading />;
  }

  return (
    <div className="flex flex-col md:items-center items-start justify-center p-4 ">
      <h2 className="text-3xl font-bold text-primaty-text mb-3">
        Training Table
      </h2>
      <TableActions scrollRef={scrollRef} categories={categories} />

      <div className="w-full relative overflow-hidden rounded-lg border-1 border-primary-button">
        <TableControls
          dates={dates}
          startIndex={startIndex}
          endIndex={endIndex}
          showPrev={showPrev}
          showNext={showNext}
          canPrev={canPrev}
          canNext={canNext}
        />
        <div className="overflow-x-auto" ref={scrollRef}>
          <table className="w-full bg-white  shadow-lg">
            <TableHeader
              visibleDates={visibleDates}
              trainingSessions={trainingSessions}
            />
            <TableBody
              exercises={exercises}
              categories={categories}
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
