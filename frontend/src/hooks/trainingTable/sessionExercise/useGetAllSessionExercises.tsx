import { useQuery } from "@tanstack/react-query";

export function useGetAllSessionExercises(clientId: string) {
  const API_URL = import.meta.env.VITE_API_URL;

  return useQuery({
    queryKey: ["sessionExercises", clientId],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/session-exercises/all?clientId=${clientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch session exercises");
      }

      return response.json();
    },
    refetchOnWindowFocus: false,
  });
}
