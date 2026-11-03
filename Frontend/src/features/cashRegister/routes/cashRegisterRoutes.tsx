import { Routes, Route } from "react-router-dom";
import CashRegister from "../pages/CashRegister";
import CashRegisterHistory from "../pages/CashRegisterHistory";

function CashRegisterRoutes() {
  return (
    <Routes>
      <Route index element={<CashRegister />} />
      <Route path="history" element={<CashRegisterHistory />} />
    </Routes>
  );
}

export default CashRegisterRoutes;
