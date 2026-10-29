import { Routes, Route } from "react-router-dom";

import Payments from "@/features/payments/pages/Payments";
import PaymentRegisterPage from "@/features/payments/pages/PaymentRegisterPage";

function PaymentRoutes() {
    return (
        <Routes>
            <Route index element={<Payments />} />
            <Route path="register" element={<PaymentRegisterPage />} />
        </Routes>
    );
}

export default PaymentRoutes;
