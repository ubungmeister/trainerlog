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
    const session = trainingSessions.find((s: Session) => s.date === date);
    if (session) {
      openTrainingSessionModal({ session: session });
    } else {
      handleCreateNewTrainingSession();
    }
  };

  let dateLenght = visibleDates.length;
  if (dateLenght < 3) {
    while (dateLenght < 3) {
      visibleDates.push(null);
      dateLenght++;
    }
  }

  return (
    <thead>
      <tr className="bg-primary-bg text-white  ">
        <th className=" left-0 z-20 bg-primary-bg  px-4 py-3 text-left min-w-[100px] sticky">
          Exercise
        </th>
        {visibleDates.map((date) => (
          <th
            onClick={() => trainingSessionHandler(date)}
            key={formatDate(date || new Date())}
            className="px-2 py-3 text-left whitespace-nowrap min-w-[70px]"
          >
            {date ? formatDate(date) : "Date +"}
          </th>
        ))}
      </tr>
    </thead>
  );
};
