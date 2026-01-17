import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface SaveCategoryType {
  id?: string | null;
  name: string;
  method: "PUT" | "POST";
}
export function useSaveCategory() {
  const API_URL = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, method }: SaveCategoryType) => {
      const path =
        method === "POST"
          ? "/api/categories/create"
          : `/api/categories/update/${id}`;
      const response = await fetch(`${API_URL}${path}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id, name }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            (method === "POST"
              ? "Failed to create category"
              : "Failed to update category"),
        );
      }
      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["allCategories"] });
      toast.success(
        variables.method === "POST" ? "Category created!" : "Category updated!",
      );
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
