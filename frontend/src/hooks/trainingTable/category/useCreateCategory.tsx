import { useMutation } from "@tanstack/react-query";
import { type Category } from "types/tableType";

export function useCreateCategory() {
  const API_URL = import.meta.env.VITE_API_URL;

  return useMutation({
    mutationFn: async (category: Category) => {
      const response = await fetch(`${API_URL}/api/categories/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      return response.json();
    },
  });
}
