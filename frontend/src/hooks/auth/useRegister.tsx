import { useMutation } from "@tanstack/react-query";
import type { SignupFormData } from "../../pages/auth/SignUp";
const API_URL = import.meta.env.VITE_API_URL;

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      return response.json();
    },
  });
};
