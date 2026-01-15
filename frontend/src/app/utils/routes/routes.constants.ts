/**
 * Centralized route path constants
 * Using constants prevents typos and makes refactoring easier
 */

export const ROUTES = {
  // Auth routes
  AUTH: {
    ROOT: "/auth",
    SIGN_IN: "/auth/signin",
    SIGN_UP: "/auth/signup",
  },

  // Main app routes
  HOME: "/",
  CLIENT: "/client/:clientId",
  CATEGORIES: "/categories",
  EXERCISES: "/exercises",
} as const;
