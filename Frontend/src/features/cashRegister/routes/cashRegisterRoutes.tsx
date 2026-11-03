import { Routes, Route } from "react-router-dom";
import CashRegister from "../pages/CashRegister";

function CashRegisterRoutes() {
  return (
    <Routes>
      <Route index element={<CashRegister />} />
    </Routes>
  );
}

export default CashRegisterRoutes;
