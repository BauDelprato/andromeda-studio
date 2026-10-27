import { Routes, Route } from "react-router-dom";
import Crews from "../pages/Crews";
import CrewProfile from "../pages/CrewProfile";
import AddStudentToCrewPage from "../pages/AddStudentToCrewPage";
import CrewEditPage from "../pages/CrewEditPage";
import CrewCreatePage from "../pages/CrewCreatePage";
import CrewTariffsPage from "../pages/CrewTariffsPage";

function CrewRoutes() {
  return (
    <Routes>
      <Route index element={<Crews />} />
      <Route path="add-student/:crewId" element={<AddStudentToCrewPage />} />
      <Route path="create" element={<CrewCreatePage />} />
      <Route path="tariffs" element={<CrewTariffsPage />} />
      <Route path=":crewId/edit" element={<CrewEditPage />} />
      <Route path=":categoryId" element={<CrewProfile />} />
    </Routes>
  );
}

export default CrewRoutes;
