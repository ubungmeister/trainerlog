import { useMutation } from "@tanstack/react-query";
const API_URL = import.meta.env.VITE_API_URL;


export const useLogin = () => {
    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }
            const result = await response.json();
            return result
        },
    });
};