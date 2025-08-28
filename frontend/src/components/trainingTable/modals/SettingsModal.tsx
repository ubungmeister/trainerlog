import { CloseButton } from "components/ui/button/CloseButton";
import { Label } from "components/ui/Label";
import { settingsTableStore } from "app/store/trainingTable/settingsTableStore";
import { clientExerciseStore } from "app/store/trainingTable/clientExerciseStore";
import { StateFilter } from "components/ui/StateFilter";

export const SettingsModal = () => {
  const closeModal = settingsTableStore((state) => state.closeModal);
  const filterState = clientExerciseStore((state) => state.filterState);
  const setFilterState = clientExerciseStore(
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
        <StateFilter filterState={filterState} setFilterState={setFilterState}/> 
      </div>
    </div>
  );
};
