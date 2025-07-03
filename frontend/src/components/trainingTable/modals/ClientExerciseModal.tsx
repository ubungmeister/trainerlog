import { CloseButton } from "components/ui/button/CloseButton";
import { SaveButton } from "components/ui/button/SaveButton";
import { DeleteButton } from "components/ui/button/DeleteButton";
import { FormInput } from "components/ui/FormInput";
import { Label } from "components/ui/Label";
import { clientExerciseStore } from "app/store/trainingTable/clientExerciseStore";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useGetAllExercises } from "hooks/trainingTable/exercises/useGetAllExercises";
import { clientExerciseListStore } from "app/store/trainingTable/clientExerciseListStore";
import { useState } from "react";
import { type Category } from "types/tableType";
const schema = z
  .object({
    exerciseName: z.string().trim().optional(),
    exerciseId: z.string().optional(),
    categoryId: z.string().optional(),
  })
  .refine(
    (data) =>
      (data.exerciseName && !data.exerciseId) ||
      (!data.exerciseName && data.exerciseId),
    {
      message:
        "Please fill either a new name or choose from the list, not both",
      path: ["exerciseName"],
    },
  );
import { useClientExerciseForm } from "hooks/trainingTable/clientExercise/useClientExerciseForm";
import type { Exercise } from "types/tableType";

export type FormSchemaType = z.infer<typeof schema>;

export const ClientExerciseModal = () => {
  const closeModal = clientExerciseStore((state) => state.closeModal);
  const clientExercise = clientExerciseStore((state) => state.clientExercise);
  const categories = clientExerciseStore((state) => state.categories);
  const category = clientExerciseStore((state) => state.category);
  const allTrainerExercises = useGetAllExercises();
  const allClientExercises = clientExerciseListStore(
    (state) => state.clientExercises,
  );

  console.log("category", category);

  // Filterout exercises that already exist in the client's list
  const existinfExercisesIds = allClientExercises.map(
    (exercise) => exercise.exerciseId,
  );

  const filteredExercises = allTrainerExercises.data?.filter(
    (exercise: Exercise) => !existinfExercisesIds.includes(exercise.id),
  );

  const [isActiveClientExercise, setIsActiveClientExercise] = useState(
    clientExercise?.activeClientExercise || false,
  );

  const formHeader = clientExercise
    ? "Edit Client Exercise"
    : "Add Client Exercise";

  const formLabel = clientExercise
    ? "Edit Exercise name"
    : "Create Exercise name";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      exerciseName: clientExercise?.exerciseName ?? "",
      categoryId: category?.id ?? "",
    },
  });

  const { onSubmit, handleDelete } = useClientExerciseForm({
    isActiveClientExercise,
    closeModal,
  });

  return (
    <div className="pointer-events-none fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 ">
      <div className="pointer-events-auto relative flex flex-col w-full max-w-xs sm:max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <CloseButton closeModal={() => closeModal()} />
        <h2 className="text-2xl font-bold text-center mb-4 sm:mb-6">
          {formHeader}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="exerciseName">{formLabel}</Label>
            <FormInput
              type="string"
              id="exerciseName"
              register={register("exerciseName")}
              error={errors.exerciseName?.message}
            />
          </div>
          {!clientExercise && (
            <div className="mb-4">
              <Label htmlFor="exerciseId">Chose from exisiting:</Label>
              <select
                id="exerciseId"
                {...register("exerciseId")}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an exercise</option>
                {filteredExercises.map((exercise: Exercise) => (
                  <option key={exercise.id} value={exercise.id}>
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
          )}
          <div>
            <Label htmlFor="categoryId">Chose category</Label>
            <select
              id="categoryId"
              {...register("categoryId")}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category </option>
              {categories?.map((category: Category) => (
                <option key={category.id} value={category.id || ""}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.exerciseName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.exerciseName.message}
              </p>
            )}
          </div>
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
