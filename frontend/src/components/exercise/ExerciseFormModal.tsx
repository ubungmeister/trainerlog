import { CloseButton } from "components/ui/button/CloseButton";
import { SaveButton } from "components/ui/button/SaveButton";
import { FormInput } from "components/ui/FormInput";
import { exerciseModalStore } from "app/store/exercise/useExerciseStore";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "components/ui/Label";
import { useSaveExercise } from "hooks/trainingTable/exercises/useSaveExercise";
import { SelectCategory } from "components/trainingTable/modals/clientExercise/helpers/SelectCategory";

const schema = z.object({
  name: z.string().min(2).max(100),
  activeExercise: z.boolean(),
  categoryId: z.string().optional(),
});

type FormSchemaType = z.infer<typeof schema>;

export const ExerciseFormModal = () => {
  const exercise = exerciseModalStore((state) => state.exercise);
  const exercises = exerciseModalStore((state) => state.exercises);
  const closeModal = exerciseModalStore((state) => state.closeModal);
  const categories = exerciseModalStore((state) => state.categories);

  const { mutate: saveExercise, isPending: isSaving } = useSaveExercise();

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
      categoryId: exercise?.categoryId ?? "",
    },
  });

  const name = watch("name");
  const activeExercise = watch("activeExercise");
  const categoryId = watch("categoryId");

  // Check if any field has changed for update mode
  const hasChanges = exercise
    ? name.trim() !== (exercise.name?.trim() ?? "") ||
      activeExercise !== exercise.activeExercise ||
      (categoryId ?? "") !== (exercise.categoryId ?? "")
    : true;

  const canSave = hasChanges && !isSaving;

  const onSubmit = (data: FormSchemaType) => {
    const id = exercise ? exercise.id : null;
    const isValidId = exercises.some((ex) => ex.id === id);

    saveExercise(
      {
        id,
        name: data.name,
        sharedExercise: true,
        activeExercise: data.activeExercise,
        categoryId: data.categoryId,
        method: isValidId ? "PUT" : "POST",
      },
      { onSuccess: closeModal },
    );
  };

  return (
    <div className="modal-form">
      <div className="modal-container">
        <div className="modal-box">
          <h2 className="text-xl font-semibold">{formHeader}</h2>
          <CloseButton closeModal={() => closeModal()} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="name">Exercise Name</Label>
            <FormInput
              type="text"
              id="name"
              register={register("name", { required: true })}
              error={errors.name?.message}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="category">Category</Label>
            <SelectCategory
              register={register}
              errors={errors}
              categories={categories}
              fieldName="categoryId"
            />
          </div>

          <div className="mb-4 flex flex-row gap-3">
            <input
              id="activeExercise"
              type="checkbox"
              className="toggle-styling"
              {...register("activeExercise")}
            />
            <Label htmlFor="activeExercise">
              {activeExercise ? "Active" : "Inactive"}
            </Label>
          </div>
          <div className="flex items-center justify-center">
            <SaveButton disabled={!canSave}>
              {isSaving ? "Saving..." : "Save"}
            </SaveButton>
          </div>
        </form>
      </div>
    </div>
  );
};
