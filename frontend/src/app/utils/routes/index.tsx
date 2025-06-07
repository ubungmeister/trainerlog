import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicOnlyRoute from "./PublicOnlyRoutes";
import {Home} from "../../../pages/home";
import {SignIn} from "../../../pages/auth/SignIn";            
import {Signup} from "../../../pages/auth/SignUp";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/signin" element={<SignIn />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
  );
};

export default AppRoutes;
