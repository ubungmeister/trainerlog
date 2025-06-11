import { useState, useEffect } from 'react';

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    userName: string | null;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        userName: null
    });

    useEffect(() => {
        // Check if user is authenticated
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const userName = localStorage.getItem('fullName');
                if (!token || !userName) {
                    setAuthState({
                        isAuthenticated: false,
                        isLoading: false,
                        userName: null
                    });
                    return;
                }

                setAuthState({
                    isAuthenticated: true,
                    isLoading: false,
                    userName: userName
                });
            } catch (error) {
                console.log(error)
                setAuthState({
                    isAuthenticated: false,
                    isLoading: false,
                    userName: null
                });
            }
        };

        checkAuth();
    }, []);

    return authState;
}
