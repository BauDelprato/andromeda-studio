import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard"; //Re-reoutear cuando se haga la pagina de dashboard!!

import StudentRoutes from "@/features/students/routes/StudentRoutes";
import CrewRoutes from "@/features/crews/routes/CrewRoutes";
import RegistrationRoutes from "@/features/registrations/routes/RegistrationRoutes";
import PaymentRoutes from "@/features/payments/routes/PaymentRoutes";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />

        <Route path="students/*" element={<StudentRoutes />} /> 
        <Route path="crews/*" element={<CrewRoutes />} /> 
        <Route path="registrations/*" element={<RegistrationRoutes />} />
        <Route path="payments/*" element={<PaymentRoutes />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;