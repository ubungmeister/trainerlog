import { useGetAllTrainingSessions } from './trainingSession/useGetAllTrainingSessions';
import { useGetAllClientExercises } from './clientExercise/useGetAllClientExercises';
import { useGetAllExercises } from './exercises/useGetAllExercises';
import { useGetAllSessionExercises } from './sessionExercise/useGetAllSessionExercises';

export const useTrainingTableData = (clientId:string) =>{
    const training = useGetAllTrainingSessions(clientId);
    const clientExercises = useGetAllClientExercises(clientId);
    const exercises = useGetAllExercises();
    const sessionExercises = useGetAllSessionExercises(clientId);

    const isLoading =
    training.isLoading ||
    clientExercises.isLoading ||
    sessionExercises.isLoading ||
    exercises.isLoading;

    return {
        isLoading,
        trainingSessions: training.data || [],
        clientExercises: clientExercises.data || [],
        exercises: exercises.data || [],
        sessionExercises: sessionExercises.data || [],
    };
}