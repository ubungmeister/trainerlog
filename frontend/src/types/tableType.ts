export interface Exercise {
  id: string;
  name: string;
  categoryId?: string | null;
  category?: string | null;
}

export interface Category {
  id: string | null;
  name: string | null;
}

export interface ClientExercise {
  id?: string;
  clientId: string;
  exerciseId?: string | null;
  categoryId?: string | null;
  exerciseName?: string | null;
  category?: string | null;
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
