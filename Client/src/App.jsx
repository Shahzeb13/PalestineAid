import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login"
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DonaterDashboard from "./pages/DonaterDashboard";
import ReceiverDashboard from "./pages/ReceiverDashboard";
import VerifyEmail from "./pages/VerifyEmial";
import ResetPassword from "./pages/ResetPassword";
import OTPDemo from "./Components/OTPDemo/OTPDemo";
import ProtectedRoute from "./Components/ProtectedRoute";
import FirstAdminSetup from "./Components/FirstAdminSetup";
import { AuthProvider } from "./Context/AuthContext";

function App() {
  const [superAdminExists, setSuperAdminExists] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSuperAdmin();
  }, []);

  const checkSuperAdmin = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/check-super-admin');
      setSuperAdminExists(response.data.exists);
    } catch (error) {
      console.error('Error checking super admin:', error);
      setSuperAdminExists(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh super admin status after creation
  const refreshSuperAdminStatus = () => {
    setSuperAdminExists(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // If no super admin exists, show setup page
  if (!superAdminExists) {
    return (
      <AuthProvider>
        <Routes>
          <Route path="/setup-super-admin" element={<FirstAdminSetup onSuccess={refreshSuperAdminStatus} />} />
          <Route path="*" element={<Navigate to="/setup-super-admin" />} />
        </Routes>
        <ToastContainer position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
        />
      </AuthProvider>
    );
  }

  // Normal app flow when super admin exists
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/donater-dashboard" element={
          <ProtectedRoute requiredRole="donater">
            <DonaterDashboard />
          </ProtectedRoute>
        } />
        <Route path="/receiver-dashboard" element={
          <ProtectedRoute requiredRole="receiver">
            <ReceiverDashboard />
          </ProtectedRoute>
        } />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp-demo" element={<OTPDemo />} />
        <Route path="/setup-super-admin" element={<Navigate to="/admin-dashboard" />} />
      </Routes>

      <ToastContainer position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
    </AuthProvider>
  );
}

export default App;
