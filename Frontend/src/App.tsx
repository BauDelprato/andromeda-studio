import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/student/Students";
import Crews from "./pages/crew/Crews";
import Registrations from "./pages/registration/Registrations";
import Payments from "./pages/payment/Payments";


import AddStudent from "./pages/student/AddStudent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/new" element={<AddStudent />} />
        <Route path="students/create" element={<AddStudent />} />
        <Route path="crews" element={<Crews />} />
        <Route path="registrations" element={<Registrations />} />
        <Route path="enrollments" element={<Registrations />} />
        <Route path="payments" element={<Payments />} />
      </Route>
    </Routes>
  );
}

export default App;
