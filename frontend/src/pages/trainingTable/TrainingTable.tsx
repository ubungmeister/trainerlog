import { useParams } from "react-router-dom";
import { Table } from "components/trainingTable/Table";
import { sessionExerciseStore } from "app/store/trainingTable/sessionExerciseStore";
import { SessionExerciseModal } from "components/trainingTable/modals/SessionExerciseModal";
import { trainingSessionStore } from "app/store/trainingTable/trainingSessionStore";
import { TrainingSessionModal } from "components/trainingTable/modals/TrainingSessionModal";
import { tableStore } from "app/store/trainingTable/tableStore";
import { useEffect } from "react";
import { clientExerciseStore } from "app/store/trainingTable/clientExerciseStore";
import { ClientExerciseModal } from "components/trainingTable/modals/clientExercise/ClientExerciseModal";
import { settingsTableStore } from "app/store/trainingTable/settingsTableStore";
import { SettingsModal } from "components/trainingTable/modals/SettingsModal";
import { useTrainingTableData } from "hooks/trainingTable/useTrainingTableData";
import { DataLoading } from "components/ui/DataLoading";
import { MainMenuButton } from "components/ui/button/MainMenuButton";
import { ModalWrapper } from "components/trainingTable/modals/ModalWrapper";

export const TrainingTable = () => {
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
    <div className="bg-primary-bg p-3">
      <div className="min-h-screen bg-primary-surface rounded-3xl">
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
    </div>
  );
};
