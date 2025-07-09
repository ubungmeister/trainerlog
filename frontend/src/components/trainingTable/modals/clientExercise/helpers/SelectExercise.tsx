import { Label } from "components/ui/Label";
import type { Exercise } from "types/tableType";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { FormSchemaType } from "components/trainingTable/modals/clientExercise/ClientExerciseModal";

type SelectExerciseProps = {
  register: UseFormRegister<FormSchemaType>;
  errors: FieldErrors<FormSchemaType>;
  filteredExercises: Exercise[] | null;
};

export const SelectExercise = ({
  register,
  errors,
  filteredExercises,
}: SelectExerciseProps) => {
  return (
    <div className="mb-4">
      <Label htmlFor="exerciseId">Chose from existing:</Label>
      <select
        id="exerciseId"
        {...register("exerciseId")}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select an exercise</option>
        {filteredExercises?.map((exercise: Exercise) => (
          <option key={exercise.id} value={exercise.id || ""}>
            {exercise.name}
          </option>
        ))}
      </select>
      {errors.exerciseName && (
        <p className="text-red-500 text-sm mt-1">
          {errors.exerciseName.message}
        </p>
      )}
    </div>
  );
};
