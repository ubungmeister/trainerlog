import { useQuery } from "@tanstack/react-query";

export function useGetUsers() {
  const API_URL = import.meta.env.VITE_API_URL;
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/users/me/clients`, {
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
