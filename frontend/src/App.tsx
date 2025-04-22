import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Reset from "./pages/auth/account-recovery/Reset";
import ResetOtpVerification from "./pages/auth/account-recovery/ResetOtpVerification";
import ResetPassword from "./pages/auth/account-recovery/ResetPassword";
import Verify from "./pages/auth/Verify";
import AccountType from "./pages/account-type/AccountType";
import Admin from "./pages/dashboard/admin/Admin";
import Overview from "./pages/dashboard/admin/pages/Overview";
import Bookings from "./pages/dashboard/admin/components/Bookings";
import UsersRoles from "./pages/dashboard/admin/pages/UsersRoles";
import Spaces from "./pages/dashboard/admin/pages/Spaces";
import AddSpacePage from "./pages/dashboard/admin/pages/AddSpacePage";
import BookRoom from "./pages/dashboard/employee/BookRoom";
import SettingsPage from "./pages/dashboard/employee/Settings";
import IntegrationsPage from "./pages/dashboard/admin/components/Integration";
import NotFound from "./routes/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App: React.FC = () => {
  //Initialize react query
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <QueryClientProvider client={queryClient}>
        <Routes>
          //Implemented a wildcard route just in case
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<Reset />} />
          <Route
            path="/reset-otp-verification"
            element={<ResetOtpVerification />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/account-type" element={<AccountType />} />
          <Route path="/dashboard" element={<Admin />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="users-roles" element={<UsersRoles />} />
            <Route path="spaces" element={<Spaces />} />
            <Route path="book-room" element={<BookRoom />} />
            <Route path="spaces/new" element={<AddSpacePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
