import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import PublicRoute from "./Routes/PublicRoute";
import ProtectedRoute from "./Routes/ProtectedRoute";
// import PlansPage from "./pages/dashboard/PlansPage";
// import TodayPage from "./pages/dashboard/TodayPage";
// import ProgressPage from "./pages/dashboard/ProgressPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute> } />
        <Route path="/verify-otp" element={<PublicRoute><VerifyOtpPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage/>} />
          {/* <Route path="plans" element={<PlansPage />} />
          <Route path="today" element={<TodayPage />} />
          <Route path="progress" element={<ProgressPage />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
