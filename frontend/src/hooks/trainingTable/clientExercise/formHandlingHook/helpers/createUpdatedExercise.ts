import type { FormSchemaType } from "components/trainingTable/modals/ClientExerciseModal";

export const createUpdatedExercise =(data: FormSchemaType, exerciseId: string)=> {
  return {
    id: exerciseId,
    name: data.exerciseName || "",
    categoryId: data.categoryId || null,
    activeExercise: data.activeClientExercise,
    sharedExercise: false,
  };
}
