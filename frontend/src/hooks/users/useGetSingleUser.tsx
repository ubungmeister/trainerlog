import { useQuery } from "@tanstack/react-query";

export function useGetSingleUser(userId: string) {
  const API_URL = import.meta.env.VITE_API_URL;
  return useQuery({
    queryKey: ["singleUser", userId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return response.json();
    },
    refetchOnWindowFocus: false,
  });
}
