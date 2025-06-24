import { useMutation } from "@tanstack/react-query";
import { type ClientExercise} from "types/tableType";

export function useDeleteClientExercise() {
  const API_URL = import.meta.env.VITE_API_URL;

  return useMutation({
    mutationFn: async (clientExercise: ClientExercise) => {
      const response = await fetch(
        `${API_URL}/api/client-exercises/delete/${clientExercise.id}?clientId=${encodeURIComponent(clientExercise.clientId)}`,
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
