import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface DeleteUserType {
  id: string;
}

export function useDeleteUser() {
  const API_URL = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteUserType) => {
      const path = `/api/users/delete/${id}`;
      const response = await fetch(`${API_URL}${path}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Client deleted!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete client");
    },
  });
}
