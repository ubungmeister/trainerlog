import { useMutation } from "@tanstack/react-query";
import { type Category } from "types/tableType";

export function useUpdateCategory() {
  const API_URL = import.meta.env.VITE_API_URL;

  return useMutation({
    mutationFn: async (category: Category) => {
      const response = await fetch(
        `${API_URL}/api/categories/update/${category.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(category),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update category");
      }
      return response.json();
    },
  });
}
