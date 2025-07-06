import type { FormSchemaType } from "components/trainingTable/modals/ClientExerciseModal";

export const createNewExercise = (data: FormSchemaType, clientId: string) => ({
  clientId,
  name: data.exerciseName || null,
  exerciseId: data.exerciseId || null,
  activeClientExercise: data.activeClientExercise,
  categoryId: data.categoryId || null,
});
