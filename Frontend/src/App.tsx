import AppRoutes from "@/app/routes/AppRoutes";
import { AuthProvider } from "@/features/auth/context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
