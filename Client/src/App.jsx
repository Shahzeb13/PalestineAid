<<<<<<< HEAD
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
<<<<<<< HEAD
import LandingPage from "./pages/LandingPage/LandingPage";
=======
import ProtectedRoute from "./Components/ProtectedRoute";
import FirstAdminSetup from "./Components/FirstAdminSetup";
import { AuthProvider } from "./Context/AuthContext";
>>>>>>> client_side_auth
=======
import Login from './components/Login';
>>>>>>> client_side_auth

function App() {
  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <>
    <Routes>
        <Route path = "/" element = {<LandingPage />} />
        <Route path = "/register"  element= {<Register />}  />
        <Route path = "/login"  element= {<Login />}  /> 
        <Route path = "/dashboard"  element = {<Dashboard />} />
        <Route path = "/verify-email"  element = {<VerifyEmail />} />
        <Route path = "/reset-password"  element = {<ResetPassword />} />
        <Route path = "/otp-demo"  element = {<OTPDemo />} />
=======
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
>>>>>>> client_side_auth
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
=======
    <div>
      <Login />
    </div>
>>>>>>> client_side_auth
  );
}

export default App;
