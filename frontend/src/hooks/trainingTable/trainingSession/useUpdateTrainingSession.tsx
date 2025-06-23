import { useMutation } from "@tanstack/react-query";
import { type Session } from "types/tableType";

export function useUpdateTrainingSession() {
  const API_URL = import.meta.env.VITE_API_URL;

  return useMutation({
    mutationFn: async (session: Session) => {
      const response = await fetch(
        `${API_URL}/api/training-sessions/update/${session.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(session),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update session exercise");
      }
      return response.json();
    },
  });
}
