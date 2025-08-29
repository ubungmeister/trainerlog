import { useQuery } from "@tanstack/react-query";
import { type Session } from "types/tableType";

// Type for the raw API response before date conversion

export function useGetAllTrainingSessions(
  clientId: string,
  fromDate: Date | null,
  toDate: Date | null,
) {
  console.log("updating data", fromDate, toDate);
  const API_URL = import.meta.env.VITE_API_URL;

  const params = new URLSearchParams({ clientId });
  if (fromDate) params.set("fromDate", fromDate.toISOString().slice(0, 10));
  if (toDate) params.set("toDate", toDate.toISOString().slice(0, 10));

  console.log("Fetching with params:", params.toString());

  return useQuery<Session[]>({
    queryKey: ["trainingSessions", clientId, fromDate, toDate],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/training-sessions/all?${params.toString()}`,
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
        date: new Date(session.date as Date),
      }));
    },
    refetchOnWindowFocus: false,
  });
}
