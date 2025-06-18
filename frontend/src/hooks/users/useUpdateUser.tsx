import { useMutation } from "@tanstack/react-query";

interface UpdateUserType {
  id?: string | null; // Optional for POST requests
  fullName: string;
  email: string;
  method: "PUT" | "POST";
}

export function useUpdateUser() {
  const API_URL = import.meta.env.VITE_API_URL;
  return useMutation({
    mutationFn: async ({ fullName, email, method, id }: UpdateUserType) => {
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
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });
}
