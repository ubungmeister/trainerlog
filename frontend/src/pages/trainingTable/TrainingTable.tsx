import { useParams } from "react-router-dom";
import { Table } from "components/trainingTable/Table";
import { sessionExerciseModalStore } from "app/store/trainingTable/sessionExerciseModalStore";
import { UserFormModal } from "components/trainingTable/SessionExerciseModal";

export const TrainingTable = () => {
  const { clientId } = useParams();
  const isOpen = sessionExerciseModalStore((state) => state.isOpen);

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)] p-4 md:p-8">
      { clientId && <Table clientId={clientId}/>}
      {isOpen&& <UserFormModal />}
    </div>
  );
};
