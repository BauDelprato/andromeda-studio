import { Routes, Route } from "react-router-dom";
import Crews from "../pages/Crews";
import CrewProfile from "../pages/CrewProfile";
import AddStudentToCrewPage from "../pages/AddStudentToCrewPage";
import CrewEditPage from "../pages/CrewEditPage";

function CrewRoutes() {
  return (
    <Routes>
      <Route index element={<Crews />} />
      <Route path="add-student/:crewId" element={<AddStudentToCrewPage />} />
      <Route path=":categoryId" element={<CrewProfile />} />
      <Route path=":crewId/edit" element={<CrewEditPage />} />
    </Routes>
  );
}

export default CrewRoutes;