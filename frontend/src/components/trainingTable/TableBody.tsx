import { type Session, type SessionExercise } from "types/tableType";
import { formatDate } from "utils/formatDate";
import { type SessionExerciseTableType } from "components/trainingTable/Table";
type TableBodyProps = {
  exerciseIds: string[];
  exerciseMap: Record<string, string>;
  visibleDates: Date[];
  trainingSessions: Session[];
  sessionExercises: SessionExercise[];
  onCellClick: ({ cell, session, exId }: SessionExerciseTableType) => void;
};

export const TableBody = ({
  exerciseIds,
  exerciseMap,
  visibleDates,
  trainingSessions,
  sessionExercises,
  onCellClick,
}: TableBodyProps) => {
  return (
    <tbody>
      {exerciseIds.map((exId: string) => (
        <tr key={exId} className="border-b border-gray-200 hover:bg-gray-50">
          <td className="sticky left-0 bg-white px-4 py-3 font-medium">
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
                onClick={() => onCellClick({cell, session, exId})}
                key={formatDate(date)}
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
  );
};
