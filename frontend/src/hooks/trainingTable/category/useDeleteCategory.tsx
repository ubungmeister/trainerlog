import { useMutation } from "@tanstack/react-query";
import { type Category } from "types/tableType";

export function useDeleteCategory() {
  const API_URL = import.meta.env.VITE_API_URL;

  return useMutation({
    mutationFn: async (category: Category) => {
      const response = await fetch(
        `${API_URL}/api/categories/delete/${category.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      return { success: true };
    },
  });
}
