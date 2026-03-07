import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routes.constants";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicOnlyRoute from "./PublicOnlyRoutes";
import { PageLoader } from "components/common/PageLoader";

// Lazy load pages for code-splitting
const SignIn = lazy(() => import("pages/auth").then((m) => ({ default: m.SignIn })));
const Signup = lazy(() => import("pages/auth").then((m) => ({ default: m.SignUp })));
const Home = lazy(() => import("pages/users"));
const TrainingTable = lazy(() => import("pages/trainingTable"));
const ExerciseLibrary = lazy(() => import("pages/exerciseLibrary"));
const Sessions = lazy(() => import("pages/sessions").then((m) => ({ default: m.SessionsPage })));
const ClientSessions = lazy(() =>
  import("pages/sessions").then((m) => ({ default: m.ClientSessionsPage })),
);

const ProtectedLayout = lazy(() => import("components/layouts/ProtectedLayout"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes - only accessible when NOT authenticated */}
        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTES.AUTH.SIGN_UP} element={<Signup />} />
          <Route path={ROUTES.AUTH.SIGN_IN} element={<SignIn />} />
        </Route>

        {/* Protected routes - only accessible when authenticated */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<ProtectedLayout />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.SESSIONS} element={<Sessions />} />
            <Route path={ROUTES.CLIENT_SESSIONS} element={<ClientSessions />} />
            <Route path={ROUTES.CLIENT} element={<TrainingTable />} />
            <Route path={ROUTES.EXERCISE_LIBRARY} element={<ExerciseLibrary />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  );
}
