import { useMutation } from "@tanstack/react-query";
import { type Session } from "types/tableType";

export function useCreateTrainingSession() {
  const API_URL = import.meta.env.VITE_API_URL;

  return useMutation({
    mutationFn: async (trainingSession: Session) => {
      const response = await fetch(`${API_URL}/api/training-sessions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(trainingSession),
      });

      if (!response.ok) {
        throw new Error("Failed to create session exercise");
      }
      return response.json();
    },
  });
}
