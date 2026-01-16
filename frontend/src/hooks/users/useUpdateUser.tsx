import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface SaveUserType {
  id?: string | null;
  fullName: string;
  email: string;
  method: "PUT" | "POST";
}

export function useSaveUser() {
  const API_URL = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fullName, email, method, id }: SaveUserType) => {
      const path =
        method === "POST" ? "/api/users/create" : `/api/users/update/${id}`;
      const response = await fetch(`${API_URL}${path}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ fullName, email }),
      });

      if (!response.ok) {
        throw new Error(
          method === "POST" ? "Failed to create user" : "Failed to update user",
        );
      }
      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(
        variables.method === "POST" ? "Client created!" : "Client updated!",
      );
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
