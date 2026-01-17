export interface Exercise {
  id: string | null;
  name: string | null;
  sharedExercise: boolean;
  activeExercise: boolean;
  categoryId?: string | null;
  category?: string | null;
}

export interface Category {
  id: string;
  name: string;
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
  date: Date | null | string;
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

export enum StateEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ALL = "all",
}
