import { useGetAllTrainingSessions } from "./trainingSession/useGetAllTrainingSessions";
import { useGetAllClientExercises } from "./clientExercise/useGetAllClientExercises";
import { useGetAllExercises } from "./exercises/useGetAllExercises";
import { useGetAllSessionExercises } from "./sessionExercise/useGetAllSessionExercises";
import { useGetAllCategories } from "hooks/trainingTable/category/useGetAllCategories";
import { useGetSingleUser } from "hooks/users/useGetSingleUser";

/**
 * Hook to fetch all data needed for the training table.
 * It retrieves training sessions, client exercises, exercises, and session exercises for a specific client and trainer
 * */

export const useTrainingTableData = (
  clientId: string,
  formDate: Date | null,
  toDate: Date | null,
) => {
  const client = useGetSingleUser(clientId);
  const training = useGetAllTrainingSessions(clientId, formDate, toDate);
  const clientExercises = useGetAllClientExercises(clientId);
  const exercises = useGetAllExercises();
  const sessionExercises = useGetAllSessionExercises(clientId);
  const categories = useGetAllCategories();

  const isLoading =
    client.isLoading ||
    training.isLoading ||
    clientExercises.isLoading ||
    sessionExercises.isLoading ||
    exercises.isLoading ||
    categories.isLoading;

  const firstError =
    (client.error as Error | undefined) ||
    (training.error as Error | undefined) ||
    (clientExercises.error as Error | undefined) ||
    (sessionExercises.error as Error | undefined) ||
    (exercises.error as Error | undefined) ||
    (categories.error as Error | undefined) ||
    null;

  return {
    isLoading,
    error: firstError,
    client: client.data || null,
    trainingSessions: training.data || [],
    clientExercises: clientExercises.data || [],
    exercises: exercises.data || [],
    sessionExercises: sessionExercises.data || [],
    categories: categories.data || [],
  };
};
