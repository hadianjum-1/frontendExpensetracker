import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AuthLayout      from "./Layouts/AuthLayout";
import DashboardLayout from "./Layouts/DashboardLayout";

// Auth Pages
import Login           from "./Pages/Auth/Login";
import Signup          from "./Pages/Auth/Signup";
import OtpVerification from "./Pages/Auth/OtpVerification";
import ForgotPassword  from "./Pages/Auth/ForgotPassword";
import ResetPassword   from "./Pages/Auth/ResetPassword";

// Dashboard Pages
import DashboardPage   from "./Pages/Dashboard/DashboardPage";
import ExpensesPage    from "./Pages/Expenses/ExpensesPage";
import IncomePage      from "./Pages/Income/IncomePage";
import CategoriesPage  from "./Pages/Categories/CategoriesPage";
import ReportsPage     from "./Pages/Reports/ReportsPage";
import ProfilePage     from "./Pages/Profile/ProfilePage";

// Utility
import ProtectedRoute  from "./Routes/ProtectedRoute";
import NotFound        from "./Pages/NotFound";

const App = () => (
  <Routes>
    {/* Auth Routes */}
    <Route element={<AuthLayout />}>
      <Route path="/"                element={<Navigate to="/login" replace />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/signup"          element={<Signup />} />
      <Route path="/Verify-otp"      element={<OtpVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password"  element={<ResetPassword />} />
    </Route>

    {/* Protected Dashboard Routes */}
    <Route
      path="/app/user"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index                   element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard"        element={<DashboardPage />} />
      <Route path="expenses"         element={<ExpensesPage />} />
      <Route path="income"           element={<IncomePage />} />
      <Route path="categories"       element={<CategoriesPage />} />
      <Route path="reports"          element={<ReportsPage />} />
      <Route path="profile"          element={<ProfilePage />} />
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
