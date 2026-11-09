import { Navigate, Routes, Route } from "react-router-dom";
import CashRegister from "../pages/CashRegister";
import CashRegisterDailyHistory from "../pages/CashRegisterDailyHistory";
import CashRegisterMonthlyHistory from "../pages/CashRegisterMonthlyHistory";

function CashRegisterRoutes() {
  return (
    <Routes>
      <Route index element={<CashRegister />} />
      <Route path="history" element={<Navigate to="daily" replace />} />
      <Route path="history/daily" element={<CashRegisterDailyHistory />} />
      <Route path="history/monthly" element={<CashRegisterMonthlyHistory />} />
    </Routes>
  );
}

export default CashRegisterRoutes;
