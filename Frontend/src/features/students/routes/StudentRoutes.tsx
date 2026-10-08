import { Routes, Route } from "react-router-dom";

import Students from "@/features/students/pages/Students";
import AddStudentPage from "@/features/students/pages/AddStudentPage";
import EditStudentPage from "@/features/students/pages/EditStudentPage";
import StudentDetail from "@/features/students/pages/StudentDetail";

function StudentRoutes() {
  return (
    <Routes>
      <Route index element={<Students />} />
      <Route path="add" element={<AddStudentPage />} />
      <Route path=":id" element={<StudentDetail />} />
      <Route path=":id/edit" element={<EditStudentPage />} />
    </Routes>
  );
}

export default StudentRoutes;