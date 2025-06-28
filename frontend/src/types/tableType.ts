export interface Exercise {
  id: string;
  name: string;
}

export interface ClientExercise {
  id?: string;
  clientId: string;
  exerciseId?: string | null;
  exerciseName?: string | null;
  activeClientExercise: boolean;
}

export interface Session {
  id?: string;
  date: Date;
  clientId: string;
}

export interface SessionExercise {
  id?: string;
  trainingSessionId: string;
  exerciseId: string;
  repetitions: number;
  sets: number;
  weight: number;
}
