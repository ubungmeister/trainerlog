import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { type Exercise } from "types/tableType";

interface SaveExerciseType extends Exercise {
  method: "PUT" | "POST";
}

export function useSaveExercise() {
  const API_URL = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ method, ...exercise }: SaveExerciseType) => {
      const path =
        method === "POST"
          ? "/api/exercises/create"
          : `/api/exercises/update/${exercise.id}`;

      const response = await fetch(`${API_URL}${path}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(exercise),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            (method === "POST"
              ? "Failed to create exercise"
              : "Failed to update exercise"),
        );
      }
      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["allExercises"] });
      toast.success(
        variables.method === "POST" ? "Exercise created!" : "Exercise updated!",
      );
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
