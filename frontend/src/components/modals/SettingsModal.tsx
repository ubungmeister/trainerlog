import { CloseButton } from "components/ui/button/CloseButton";
import { Label } from "components/ui/Label";
import { settingsTableStore } from "app/store/trainingTable/settingsTableStore";
import { clientExerciseListStore } from "app/store/trainingTable/clientExerciseListStore";

export const SettingsModal = () => {
  const closeModal = settingsTableStore((state) => state.closeModal);
  const filterState = clientExerciseListStore((state) => state.filterState);
  const setFilterState = clientExerciseListStore(
    (state) => state.setFilterState,
  );

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative flex flex-col w-full max-w-xs sm:max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <CloseButton closeModal={() => closeModal()} />
        <h2 className="text-2xl font-bold text-center mb-4 sm:mb-6">
          Settings
        </h2>
        <div className="mb-2">
          <Label htmlFor="exerciseName"> Client Exercises filter:</Label>
        </div>
        <div className="flex items-center justify-start gap-2 mb-6">
          <button
            onClick={() => setFilterState("all")}
            className={`button-filter ${filterState === "all" ? " bg-primary-menu" : "bg-gray-400"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterState("active")}
            className={`button-filter ${filterState === "active" ? " bg-primary-menu" : "bg-gray-400"}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterState("inactive")}
            className={` button-filter ${filterState === "inactive" ? " bg-primary-menu" : "bg-gray-400"}`}
          >
            Inactive
          </button>
        </div>
      </div>
    </div>
  );
};
