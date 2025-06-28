import { type Session } from "types/tableType";
import { formatDate } from "utils/formatDate";
import { trainingSessionStore } from "app/store/trainingTable/trainingSessionStore";
type TableHeaderProps = {
  visibleDates: Date[];
  trainingSessions: Session[];
};

export const TableHeader = ({
  visibleDates,
  trainingSessions,
}: TableHeaderProps) => {
  //Zustand store for managing training session modal state
  const openTrainingSessionModal = trainingSessionStore(
    (state) => state.openModal,
  );
  // Function to handle updating a training session, called when a date in the header is clicked
  const trainingSessionHandler = (date: Date) => {
    const session = trainingSessions.find((s: Session) => s.date === date);
    if (session) {
      openTrainingSessionModal({ session: session });
    } else {
      console.error("Session not found for date:", date);
    }
  };

  return (
    <thead>
      <tr className="bg-primary-bg text-white  ">
        <th className=" left-0 z-20 bg-primary-bg  px-4 py-3 text-left min-w-[100px] sticky">
          Exercise
        </th>
        {visibleDates.map((date) => (
          <th
            onClick={() => trainingSessionHandler(date)}
            key={formatDate(date)}
            className="px-2 py-3 text-left whitespace-nowrap min-w-[70px]"
          >
            {formatDate(date)}
          </th>
        ))}
      </tr>
    </thead>
  );
};
