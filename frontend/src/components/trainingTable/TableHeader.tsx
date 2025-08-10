import { type Session } from "types/tableType";
import { formatDate } from "utils/formatDate";
import { trainingSessionStore } from "app/store/trainingTable/trainingSessionStore";
import { tableStore } from "app/store/trainingTable/tableStore";
import { useCreateTrainingSession } from "hooks/trainingTable/trainingSession/useCreateTrainingSession";
import { useQueryClient } from "@tanstack/react-query";
type TableHeaderProps = {
  visibleDates: Array<Date | null>;
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

  const clientId = tableStore((state) => state.clientId);
  const queryClient = useQueryClient();

  const { mutate: createTrainingSession } = useCreateTrainingSession();

  const handleCreateNewTrainingSession = () => {
    const newSession: Session = {
      date: new Date(),
      clientId: clientId,
    };
    createTrainingSession(newSession, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["trainingSessions", clientId],
        });
      },
    });
  };

  // Function to handle updating a training session, called when a date in the header is clicked
  const trainingSessionHandler = (date: Date | null) => {
    console.log("TableHeader: clicked date", date);

    // Use getTime() to compare date values, not object references
    const session = trainingSessions.find((s: Session) => {
      if (!date || !s.date) return false;
      const clickedDate = new Date(date).getTime();
      const sessionDate = new Date(s.date).getTime();
      console.log("Comparing dates:", {
        clickedDate,
        sessionDate,
        matches: clickedDate === sessionDate,
      });
      return clickedDate === sessionDate;
    });

    console.log("TableHeader: found session", session);

    if (session) {
      openTrainingSessionModal({ session: session });
    } else {
      handleCreateNewTrainingSession();
    }
  };

  // Limit the number of columns to the last 5 dates, then pad if needed
  const maxColumns = 5;
  const slicedDates = visibleDates.slice(-maxColumns);
  const paddedDates = [...slicedDates];
  while (paddedDates.length < 3) {
    paddedDates.push(null);
  }


  return (
    <thead>
      <tr className="bg-primary-bg text-white  ">
        <th className=" left-0 z-20 bg-primary-bg  px-4 py-3 text-left min-w-[100px] sticky">
          Exercise
        </th>
        {paddedDates.map((date, idx) => {
          const dateStr = date ? formatDate(date) : "Date +";
          console.log("Rendering header column", { idx, date, dateStr });
          return (
            <th
              key={date ? `date-${date.getTime()}` : `empty-${idx}`}
              onClick={() => trainingSessionHandler(date)}
              className="px-4 py-3 cursor-pointer"
            >
              {dateStr}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
