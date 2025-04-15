import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Reset from "./pages/auth/account-recovery/Reset";
import ResetOtpVerification from "./pages/auth/account-recovery/ResetOtpVerification";
import ResetPassword from "./pages/auth/account-recovery/ResetPassword";
import Verify from "./pages/auth/Verify";
import AccountType from "./pages/account-type/AccountType";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>

        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/reset-otp-verification" element={<ResetOtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account-type" element={<AccountType />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
