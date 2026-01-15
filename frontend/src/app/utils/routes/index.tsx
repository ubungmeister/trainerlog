import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routes.constants";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicOnlyRoute from "./PublicOnlyRoutes";
import { PageLoader } from "components/common/PageLoader";

// Lazy load pages for code-splitting
const SignIn = lazy(() => import("pages/auth/SignIn"));
const Signup = lazy(() => import("pages/auth/SignUp"));
const Home = lazy(() => import("pages/home"));
const TrainingTable = lazy(() => import("pages/trainingTable/TrainingTable"));
const Category = lazy(() => import("pages/category/Category"));
const Exercise = lazy(() => import("pages/exercise/Exercise"));

const ProtectedLayout = lazy(
  () => import("components/layouts/ProtectedLayout"),
);

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
            <Route path={ROUTES.CLIENT} element={<TrainingTable />} />
            <Route path={ROUTES.CATEGORIES} element={<Category />} />
            <Route path={ROUTES.EXERCISES} element={<Exercise />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  );
}
