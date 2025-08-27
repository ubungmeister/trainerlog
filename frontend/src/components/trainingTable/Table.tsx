import { useEffect, useRef, useMemo, useState } from "react";
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateRangePicker } from "@mui/x-date-pickers-pro/MobileDateRangePicker";

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

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const {
    isLoading,
    trainingSessions,
    clientExercises,
    exercises,
    sessionExercises,
    categories,
  } = useTrainingTableData(clientId || "", dateRange[0], dateRange[1]);

  const initialDateRangeSet = useRef(false);

  useEffect(() => {
    // Only set the date range if:
    // 1. We haven't set it yet, AND
    // 2. We have training sessions loaded
    if (!initialDateRangeSet.current && trainingSessions.length > 1) {

      // Sort sessions and find the date range
      const sorted = sortSessionsByDate(trainingSessions);
      const firstDate = sorted[0].date;
      const lastDate = sorted[sorted.length - 1].date;

      // Only set if we have valid dates
      if (firstDate && lastDate) {
        setDateRange([new Date(firstDate), new Date(lastDate)]);
        // Mark that we've set the initial date range
        initialDateRangeSet.current = true;
      }
    }
  }, [trainingSessions]);

  const handleDateRangeChange = (
    newValue: [Date | null, Date | null] | null,
  ) => {
    if (newValue && newValue[0] && newValue[1]) {
      setDateRange(newValue);
    }
  };

  useEffect(() => {
    setClientExercises(clientExercises || []);
  }, [clientExercises]);

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
  } = useDateWindow(dates, 3, 1);

  if (isLoading) {
    return <DataLoading />;
  }

  return (
    <div className="flex flex-col md:items-center items-start justify-center p-4 ">
      <h2 className="text-3xl font-bold text-primaty-text mb-3">
        Training Table
      </h2>
      <TableActions categories={categories} />

      <div className="w-full relative overflow-hidden rounded-lg border-1 border-primary-button">
        <div className="flex justify-center items-center w-full">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
            />
          </LocalizationProvider>
        </div>
        <div className="overflow-x-auto">
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
        <TableControls
          dates={dates}
          startIndex={startIndex}
          endIndex={endIndex}
          showPrev={showPrev}
          showNext={showNext}
          canPrev={canPrev}
          canNext={canNext}
        />
      </div>
    </div>
  );
};
