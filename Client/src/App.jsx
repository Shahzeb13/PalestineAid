import { useState } from "react";
import { ToastContainer } from "react-toastify";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login"
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="bg-gradient-to-r from-dimblue to-dimwhite w-full min-h-screen">
      <Routes>
        <Route path = "/" element = {< Navigate to="/register" />} />
        <Route path = "/register"  element= {<Register />}  />
        <Route path = "/login"  element= {<Login />}  /> 
        <Route path = "/dashboard"  element = {<Dashboard />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
