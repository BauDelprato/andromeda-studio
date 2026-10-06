import { Routes, Route } from "react-router-dom";

import Crews from "@/features/crews/pages/Crews";

function CrewRoutes() {
    return (
        <Routes>
            <Route index element={<Crews />} />
        </Routes>
    );
}

export default CrewRoutes;