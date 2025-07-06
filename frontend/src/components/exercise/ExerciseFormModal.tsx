import { CloseButton } from "components/ui/button/CloseButton";
import { SaveButton } from "components/ui/button/SaveButton";
import { FormInput } from "components/ui/FormInput";
import { exerciseModalStore } from "app/store/exercise/useExerciseStore";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateExercise } from "hooks/trainingTable/exercises/useCreateExercise";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "components/ui/Label";
const schema = z.object({
  name: z.string().min(2).max(100),
  activeExercise: z.boolean(),
});

type FormSchemaType = z.infer<typeof schema>;

export const ExerciseFormModal = () => {
  const exercise = exerciseModalStore((state) => state.exercise);
  const exercises = exerciseModalStore((state) => state.exercises);
  const closeModal = exerciseModalStore((state) => state.closeModal);

  const { mutate: createExercise } = useCreateExercise();
  const { mutate: updateExercise } = useCreateExercise();

  const queryClient = useQueryClient();

  const formHeader = exercise ? "Edit Exercise" : "Create Exercise";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: exercise?.name ?? "",
      activeExercise: exercise?.activeExercise ?? true,
    },
  });

  const activeExercise = watch("activeExercise");

  const onSubmit = (data: FormSchemaType) => {
    const name = data.name;
    const id = exercise ? exercise.id : null;

    const isValidId = exercises.some((ex) => ex.id === id);
    if (!id) {
      createExercise(
        { name, id, sharedExercise: true, activeExercise: true },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allExercises"] });
            closeModal();
          },
          onError: (error) => {
            console.error("Error creating exercise:", error);
          },
        },
      );
    } else if (isValidId) {
      updateExercise(
        { name, id, sharedExercise: true, activeExercise: true },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allExercises"] });
            closeModal();
          },
          onError: (error) => {
            console.error("Error updating exercise:", error);
          },
        },
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-start justify-center p-10">
      <div className="flex flex-col w-full max-w-md bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{formHeader}</h2>
          <CloseButton closeModal={() => closeModal()} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="name">Category Name</Label>
            <FormInput
              type="text"
              id="name"
              register={register("name", { required: true })}
              error={errors.name?.message}
            />
          </div>
          <div className="mb-4 flex flex-row gap-3">
            <input
              id="activeExercise"
              type="checkbox"
              className="toggle-styling"
              {...register("activeExercise")}
            />
            <Label htmlFor="sets">
              {activeExercise ? "Active" : "Non active"}
            </Label>
          </div>
          <div className="flex items-center justify-center">
            <SaveButton />
          </div>
        </form>
      </div>
    </div>
  );
};
