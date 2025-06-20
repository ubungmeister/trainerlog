import { useQuery } from "@tanstack/react-query";

export function useGetAllClientExercises(clientId: string) {
  const API_URL = import.meta.env.VITE_API_URL;

  return useQuery({
    queryKey: ["clientExercises", clientId],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/client_exercises/all?clientId=${clientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch training sessions");
      }

      return response.json();
    },
    refetchOnWindowFocus: false,
  });
}
