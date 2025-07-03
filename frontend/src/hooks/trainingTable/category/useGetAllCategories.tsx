import { useQuery } from "@tanstack/react-query";

export function useGetAllCategories() {
  const API_URL = import.meta.env.VITE_API_URL;

  return useQuery({
    queryKey: ["allCategories"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/categories/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      return response.json();
    },
    refetchOnWindowFocus: false,
  });
}
