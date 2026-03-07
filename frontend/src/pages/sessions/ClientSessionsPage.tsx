import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useTrainingTableData } from "hooks/trainingTable/useTrainingTableData";
import { useGetSingleUser } from "hooks/users/useGetSingleUser";
import { DataLoading } from "components/ui/DataLoading";
import { ExerciseHistoryList } from "components/sessions/exerciseHistory/ExerciseHistoryList";
import { SessionList } from "components/sessions/sessionList/SessionList";
import { AddEntryModal } from "components/sessions/AddEntryModal";
import { TabToggle } from "components/ui/TabToggle";

type TabType = "exercises" | "sessions";

const TABS: { value: TabType; label: string }[] = [
  { value: "exercises", label: "Exercises" },
  { value: "sessions", label: "Sessions" },
];

export default function ClientSessionsPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("exercises");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: client } = useGetSingleUser(clientId ?? "");
  const { isLoading, error, trainingSessions, sessionExercises, clientExercises, exercises } =
    useTrainingTableData(clientId ?? "", null, null);

  if (isLoading) {
    return <DataLoading />;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error.message}</p>
        <button onClick={() => navigate("/sessions")} className="mt-4 text-primary-bg underline">
          Back to clients
        </button>
      </div>
    );
  }

  return (
    <div className="page-content-box">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/sessions")}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={22} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{client?.fullName ?? "Client"}</h1>
        </div>

        <TabToggle
          tabs={TABS}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as TabType)}
        />

        {activeTab === "exercises" ? (
          <ExerciseHistoryList
            trainingSessions={trainingSessions}
            sessionExercises={sessionExercises}
            clientExercises={clientExercises}
            onAddEntry={() => setIsAddModalOpen(true)}
          />
        ) : (
          <SessionList
            trainingSessions={trainingSessions}
            sessionExercises={sessionExercises}
            onAddEntry={() => setIsAddModalOpen(true)}
          />
        )}
      </div>

      {isAddModalOpen && clientId && (
        <AddEntryModal
          clientId={clientId}
          clientExercises={clientExercises}
          exercises={exercises}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}
