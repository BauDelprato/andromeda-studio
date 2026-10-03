import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/student/Students";
import AddStudentPage from "./pages/student/AddStudentPage";
import StudentDetail from "./pages/student/StudentDetail";
import Crews from "./pages/crew/Crews";
import Registrations from "./pages/registration/Registrations";
import Payments from "./pages/payment/Payments";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/add" element={<AddStudentPage />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="crews" element={<Crews />} />
        <Route path="registrations" element={<Registrations />} />
        <Route path="payments" element={<Payments />} />
      </Route>
    </Routes>
  );
}

export default App;
