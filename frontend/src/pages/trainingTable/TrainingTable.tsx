import { useParams } from "react-router-dom";
import {
  Table,
  SessionExerciseModal,
  TrainingSessionModal,
  ClientExerciseModal,
  SettingsModal,
  ModalWrapper,
} from "components/trainingTable";
import { sessionExerciseStore } from "app/store/trainingTable/sessionExerciseStore";
import { trainingSessionStore } from "app/store/trainingTable/trainingSessionStore";
import { tableStore } from "app/store/trainingTable/tableStore";
import { useEffect } from "react";
import { clientExerciseStore } from "app/store/trainingTable/clientExerciseStore";
import { settingsTableStore } from "app/store/trainingTable/settingsTableStore";
import { useTrainingTableData } from "hooks/trainingTable";
import { DataLoading, MainMenuButton } from "components/ui";

export default function TrainingTable() {
  const { clientId } = useParams();
  const setClientId = tableStore((state) => state.setClientId);
  const isSessionExerciseOpen = sessionExerciseStore((state) => state.isOpen);
  const isTrainingSessionOpen = trainingSessionStore((state) => state.isOpen);
  const isClientExerciseOpen = clientExerciseStore((state) => state.isOpen);
  const isSettingsOpen = settingsTableStore((state) => state.isOpen);

  const { isLoading, error } = useTrainingTableData(clientId ?? "", null, null);

  useEffect(() => {
    if (clientId) {
      setClientId(clientId);
    }
  }, [clientId, setClientId]);

  if (isLoading) {
    return <DataLoading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-red-600 gap-y-2">
        <p>{error.message}</p>
        <MainMenuButton />
      </div>
    );
  }

  return (
    <div className="page-content-box">
      {clientId && <Table clientId={clientId} />}

      <ModalWrapper isOpen={isSessionExerciseOpen}>
        <SessionExerciseModal />
      </ModalWrapper>

      <ModalWrapper isOpen={isTrainingSessionOpen}>
        <TrainingSessionModal />
      </ModalWrapper>

      <ModalWrapper isOpen={isClientExerciseOpen}>
        <ClientExerciseModal />
      </ModalWrapper>

      <ModalWrapper isOpen={isSettingsOpen}>
        <SettingsModal />
      </ModalWrapper>
    </div>
  );
}
