import { Routes, Route } from "react-router-dom";

import Payments from "@/features/payments/pages/Payments";

function PaymentRoutes() {
    return (
        <Routes>
            <Route index element={<Payments />} />
        </Routes>
    );
}

export default PaymentRoutes;