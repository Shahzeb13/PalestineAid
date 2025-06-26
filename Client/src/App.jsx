import { useState } from "react";
import { ToastContainer } from "react-toastify";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login"
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmial";
import ResetPassword from "./pages/ResetPassword";
import OTPDemo from "./Components/OTPDemo/OTPDemo";
import LandingPage from "./pages/LandingPage/LandingPage";

function App() {
  return (
    <>
    <Routes>
        <Route path = "/" element = {<LandingPage />} />
        <Route path = "/register"  element= {<Register />}  />
        <Route path = "/login"  element= {<Login />}  /> 
        <Route path = "/dashboard"  element = {<Dashboard />} />
        <Route path = "/verify-email"  element = {<VerifyEmail />} />
        <Route path = "/reset-password"  element = {<ResetPassword />} />
        <Route path = "/otp-demo"  element = {<OTPDemo />} />
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
      </>
      
  );
}

export default App;
