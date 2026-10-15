import { Routes, Route } from "react-router-dom";
import Crews from "../pages/Crews";
import CrewProfile from "../pages/CrewProfile";
import AddStudentToCrewPage from "../pages/AddStudentToCrewPage";

function CrewRoutes() {
  return (
    <Routes>
      <Route index element={<Crews />} />
      <Route path="add-student/:crewId" element={<AddStudentToCrewPage />} />
      <Route path=":categoryId" element={<CrewProfile />} />
    </Routes>
  );
}

export default CrewRoutes;