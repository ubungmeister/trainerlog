import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "contexts/AuthContext";
import AppRoutes from "app/utils/routes";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
