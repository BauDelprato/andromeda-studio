import { Routes, Route } from "react-router-dom";

import Registrations from "@/features/registrations/pages/Registrations";


function RegistrationRoutes() {
    return (
        <Routes>
            <Route index element={<Registrations />} />
        </Routes>
    );
}

export default RegistrationRoutes;