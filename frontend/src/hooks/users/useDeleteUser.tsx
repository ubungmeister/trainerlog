import { useMutation } from "@tanstack/react-query";

interface UpdateUserType {
  id: string;
}

export function useDeleteUser() {
  const API_URL = import.meta.env.VITE_API_URL;
  return useMutation({
    mutationFn: async ({ id }: UpdateUserType) => {
      const path = `/api/users/delete/${id}`;
      const response = await fetch(`${API_URL}${path}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(" Failed to delete user");
      }
      return response.json();
    },
  });
}
