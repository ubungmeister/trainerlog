import { useParams } from "react-router-dom";
import { Table } from "components/trainingTable/Table";
import { sessionExerciseStore } from "app/store/trainingTable/sessionExerciseStore";
import { SessionExerciseModal } from "components/trainingTable/modals/SessionExerciseModal";
import { trainingSessionStore } from "app/store/trainingTable/trainingSessionStore";
import { TrainingSessionModal } from "components/trainingTable/modals/TrainingSessionModal";
import { tableStore } from "app/store/trainingTable/tableStore";
import { useEffect } from "react";
import { clientExerciseStore } from "app/store/trainingTable/clientExerciseStore";
import { ClientExerciseModal } from "components/trainingTable/modals/ClientExerciseModal";
import { settingsTableStore } from "app/store/trainingTable/settingsTableStore";
import { SettingsModal } from "components/trainingTable/modals/SettingsModal";

export const TrainingTable = () => {
  const { clientId } = useParams();
  const setClientId = tableStore((state) => state.setClientId);
  const isSessionExerciseOpen = sessionExerciseStore((state) => state.isOpen);
  const isTrainingSessionOpen = trainingSessionStore((state) => state.isOpen);
  const isClientExerciseOpen = clientExerciseStore((state) => state.isOpen);
  const isSettingsOpen = settingsTableStore((state) => state.isOpen);

 
  useEffect(() => {
    if (clientId) {
      setClientId(clientId);
    }
  }, [clientId, setClientId]);

  return (
    <div className=" bg-primary-bg p-3 ">
      <div className=" min-h-screen bg-primary-surface rounded-3xl">
        {clientId && <Table clientId={clientId} />}
        {isSessionExerciseOpen && <SessionExerciseModal />}
        {isTrainingSessionOpen && <TrainingSessionModal />}
        {isClientExerciseOpen && <ClientExerciseModal />}
        {isSettingsOpen && <SettingsModal />}
      </div>
    </div>
  );
};
