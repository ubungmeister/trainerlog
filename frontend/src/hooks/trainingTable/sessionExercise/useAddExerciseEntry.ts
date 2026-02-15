import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddExerciseEntryRequest {
  clientId: string;
  date: string; // "YYYY-MM-DD"
  exerciseId: string;
  sets: number;
  repetitions: number;
  weight: number;
}

export function useAddExerciseEntry() {
  const API_URL = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddExerciseEntryRequest) => {
      const response = await fetch(
        `${API_URL}/api/session-exercises/add-entry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to add exercise entry");
      }

      return response.json();
    },
    onSuccess: (_data, variables) => {
      // Invalidate related queries so the UI refreshes
      queryClient.invalidateQueries({
        queryKey: ["sessionExercises", variables.clientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["trainingSessions", variables.clientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["clientExercises", variables.clientId],
      });
    },
  });
}
