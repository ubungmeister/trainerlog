import { useQuery } from "@tanstack/react-query";
import { type Session } from "types/tableType";

// Type for the raw API response before date conversion

export function useGetAllTrainingSessions(clientId: string) {
  const API_URL = import.meta.env.VITE_API_URL;

  return useQuery<Session[]>({
    queryKey: ["trainingSessions", clientId],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/training-sessions/all?clientId=${clientId}`,
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

      // Get the raw response data
      const data: Session[] = await response.json();

      // Transform the date strings to Date objects
      return data.map((session) => ({
        ...session,
        date: new Date(session.date),
      }));
    },
    refetchOnWindowFocus: false,
  });
}
