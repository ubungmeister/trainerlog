import { type Session } from "types/tableType";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateTrainingSession } from "hooks/trainingTable/trainingSession/useCreateTrainingSession";
import { trainingSessionStore } from "app/store/trainingTable/trainingSessionStore";
import { tableStore } from "app/store/trainingTable/tableStore";
import { clientExerciseStore } from "app/store/trainingTable/clientExerciseStore";

type TableActionsProps = {
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

export const TableActions = ({ scrollRef }: TableActionsProps) => {
  const queryClient = useQueryClient();
  const session = trainingSessionStore((state) => state.session);
  const clientId = tableStore((state) => state.clientId);
  const { mutate: createTrainingSession } = useCreateTrainingSession();
  const openModal = clientExerciseStore((state) => state.openModal);

  const handleCreateNewTrainingSession = () => {
    const newSession: Session = {
      date: new Date(),
      clientId: clientId,
    };
    createTrainingSession(newSession, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["trainingSessions", session?.clientId],
        });

        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
      },
    });
  };

  const handleCreateNewExercise = () => {
    console.log("handleCreateNewExercise called");
    openModal({
      clientExercise: null,
      exercises: [],
    });
  };

  return (
    <div className=" flex flex-row gap-2 text-white  py-2 mb-4 rounded-lg justify-start">
      <button
        onClick={handleCreateNewTrainingSession}
        className="bg-[var(--color-primary-menu)] px-4 py-2 rounded-full hover:bg-[var(--color-primary-menu-hover)] transition-colors duration-200"
      >
        Add new training
      </button>
      <button
        onClick={handleCreateNewExercise}
        className="bg-[var(--color-primary-menu)] px-4 py-2 rounded-full hover:bg-[var(--color-primary-menu-hover)] transition-colors duration-200"
      >
        Add new exercise
      </button>
    </div>
  );
};
