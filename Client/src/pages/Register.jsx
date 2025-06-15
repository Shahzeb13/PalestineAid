import { useState } from "react";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password },
        { withCredentials: true }
      );

      if (!response) {
        console.error("Response Object not found");
        return;
      }
      const message = response.data.message;
      toast.success(message);

      setName("");
      setPassword("");
      setEmail("");

      navigate('/dashboard');
    } catch (err) {
      const errMsg = err.response?.data?.message || "Registration failed";
      toast.error(errMsg);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
        <h2 style={{ fontWeight: "bold", fontSize: "1rem" }}>Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            border: "1px solid #ccc",
            width: "70%",
            padding: "0.5rem",
            borderRadius: "999px"
          }}
        />
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
          Register
        </button>
        <Link to="/login">
          Already have an account? <span style={{ textDecoration: "underline" }}>Login</span>
        </Link>
      </form>
    </div>
  );
};

export default Register