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
const schema = z
  .object({
    exerciseName: z.string().trim().optional(),
    exerciseId: z.string().optional(),
    categoryId: z.string().optional(),
    activeClientExercise: z.boolean(),
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
import { useClientExerciseForm } from "hooks/trainingTable/clientExercise/formHandlingHook/useClientExerciseForm";
import type { Exercise } from "types/tableType";
import { SelectExercise } from "./helpers/SelectExercise";
import { SelectCategory } from "./helpers/SelectCategory";

export type FormSchemaType = z.infer<typeof schema>;

export const ClientExerciseModal = () => {
  const closeModal = clientExerciseStore((state) => state.closeModal);
  const clientExercise = clientExerciseStore((state) => state.clientExercise);
  const categories = clientExerciseStore((state) => state.categories);
  const category = clientExerciseStore((state) => state.category);
  const exercises = clientExerciseStore((state) => state.exercises);
  const allTrainerExercises = useGetAllExercises();
  const allClientExercises = clientExerciseListStore(
    (state) => state.clientExercises,
  );

  // Filterout exercises that already exist in the client's list
  const existingExercisesIds = allClientExercises.map(
    (exercise) => exercise.exerciseId,
  );

  const filteredExercises = allTrainerExercises.data?.filter(
    (exercise: Exercise) => !existingExercisesIds.includes(exercise.id),
  );

  const exercise = exercises?.find(
    (ex: Exercise) => ex.id === clientExercise?.exerciseId,
  );
  const isSharedExercise = exercise?.sharedExercise;

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
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      exerciseName: clientExercise?.exerciseName ?? "",
      categoryId: category?.id ?? "",
      activeClientExercise: clientExercise?.activeClientExercise ?? true,
    },
  });

  const isActiveClientExercise = watch("activeClientExercise");

  const { onSubmit, handleDelete } = useClientExerciseForm({
    closeModal,
  });

  return (
    <div className="pointer-events-none fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 ">
      <div className="pointer-events-auto relative flex flex-col w-full max-w-xs sm:max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <CloseButton closeModal={closeModal} />
        <h2 className="text-2xl font-bold text-center mb-4 sm:mb-6">
          {formHeader}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {isSharedExercise ? (
            <p className="text-red-500 text-sm mb-4">
              This exercise is shared and cannot be modified.
            </p>
          ) : (
            <div className="mb-4">
              <Label htmlFor="exerciseName">{formLabel}</Label>
              <FormInput
                type="string"
                id="exerciseName"
                register={register("exerciseName")}
                error={errors.exerciseName?.message}
              />
            </div>
          )}

          {!clientExercise && (
            <SelectExercise
              register={register}
              errors={errors}
              filteredExercises={filteredExercises}
            />
          )}
          {!isSharedExercise && (
            <SelectCategory
              register={register}
              errors={errors}
              categories={categories}
            />
          )}

          <div className="mb-4 flex flex-row gap-3">
            <input
              id="activeClientExercise"
              {...register("activeClientExercise")}
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
