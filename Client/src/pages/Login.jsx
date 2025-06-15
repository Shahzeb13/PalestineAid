import { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      // if (!response) {
      //   console.error("Response Object not found");
      //   return;
      // }
      const message = response.data.message;
      toast.success(message);

      setPassword("");
      setEmail("");

      navigate('/dashboard');
    } catch (err) {
      const errMsg = err.response?.data?.message || "Login failed";
      toast.error(errMsg);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center"  }}>
      <form
        style={{
          width: "340px",
          minHeight: "400px",
          background: "#f9f9f9",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          fontFamily: "inherit"
        }}
        onSubmit={handleSubmit}
      >
        <h2 style={{ fontWeight: "bold", fontSize: "1rem" }}>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            border: "1px solid #ccc",
            width: "70%",
            padding: "0.5rem",
            borderRadius: "999px"
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            border: "1px solid #ccc",
            width: "70%",
            padding: "0.5rem",
            borderRadius: "999px"
          }}
        />
        <button
          style={{
            borderRadius: "999px",
            padding: "0.5rem 1.5rem",
            background: "#1e293b",
            color: "white",
            border: "none"
          }}
          type="submit"
        >
          Login
        </button>
        <Link to="/register">
          Register Your Account here? <span style={{ textDecoration: "underline" }}>Register</span>
        </Link>
      </form>
    </div>
  );
};

export default Login