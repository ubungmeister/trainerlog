import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicOnlyRoute from "./PublicOnlyRoutes";
import { SignIn } from "../../../pages/auth/SignIn";
import { Signup } from "../../../pages/auth/SignUp";
import { Home } from "../../../pages/home";
import ProtectedLayout from "../../../components/layouts/ProtectedLayout";
import { TrainingTable } from "../../../pages/trainingTable/TrainingTable";
import { Category } from "pages/category/Category";
import { Exercise } from "pages/exercise/Exercise";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/signin" element={<SignIn />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/client/:clientId" element={<TrainingTable />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/exercises" element={<Exercise />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
