import { CloseButton } from "components/ui/button/CloseButton";
import { SaveButton } from "components/ui/button/SaveButton";
import { DeleteButton } from "components/ui/button/DeleteButton";
import { FormInput } from "components/ui/FormInput";
import { Label } from "components/ui/Label";
import { clientExerciseStore } from "app/store/trainingTable/clientExerciseStore";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useState } from "react";

const schema = z.object({
  exerciseName: z.string().min(1, "Exercise name is required").trim(),
});
import { useClientExerciseForm } from "hooks/trainingTable/clientExercise/useClientExerciseForm";

export type FormSchemaType = z.infer<typeof schema>;

export const ClientExerciseModal = () => {
  const closeModal = clientExerciseStore((state) => state.closeModal);
  const clientExercise = clientExerciseStore((state) => state.clientExercise);

  const [isActiveClientExercise, setIsActiveClientExercise] = useState(
    clientExercise?.activeClientExercise || false,
  );
  console.log(isActiveClientExercise);

  const formHeader = clientExercise
    ? "Edit Client Exercise"
    : "Add Client Exercise";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: clientExercise?.exerciseName
      ? { exerciseName: clientExercise.exerciseName }
      : { exerciseName: "" },
  });

  const { onSubmit, handleDelete } = useClientExerciseForm({
    isActiveClientExercise,
    closeModal,
  });

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative flex flex-col w-full max-w-xs sm:max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <CloseButton closeModal={() => closeModal()} />
        <h2 className="text-2xl font-bold text-center mb-4 sm:mb-6">
          {formHeader}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="exerciseName">Exercise name</Label>
            <FormInput
              type="string"
              id="exerciseName"
              register={register("exerciseName")}
              error={errors.exerciseName?.message}
            />
          </div>
          {clientExercise && (
            <div className="mb-4 flex flex-row gap-3">
              <input
                onChange={(e) => {
                  setIsActiveClientExercise(e.target.checked);
                }}
                checked={isActiveClientExercise}
                id="activeClientExercise"
                name="activeClientExercise"
                type="checkbox"
                className="toggle-styling"
              />
              <Label htmlFor="sets">
                {isActiveClientExercise ? "Active" : "Non active"}
              </Label>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 mt-4">
            {clientExercise?.id && (
              <DeleteButton handleDelete={(e) => handleDelete(e)} />
            )}
            <SaveButton />
          </div>
        </form>
      </div>
    </div>
  );
};
