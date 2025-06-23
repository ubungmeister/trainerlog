import { useMutation } from "@tanstack/react-query";
import { type Session } from "types/tableType";

export function useDeleteTrainingSession() {
  const API_URL = import.meta.env.VITE_API_URL;

  return useMutation({
    mutationFn: async (session: Session) => {
      const response = await fetch(
        `${API_URL}/api/training-sessions/delete/${session.id}?clientId=${encodeURIComponent(session.clientId)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete session exercise");
      }
      return { success: true };
    },
  });
}
