import React, { useState } from "react";
import client from "../api/client";
import { saveAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await client.post("/auth/login", { email, password });
      if (!res.data.user || !res.data.token) throw new Error("Invalid response from server");
      saveAuth(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (error) {
      setErr(error.response?.data?.message || error.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "50px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Login</h2>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {err && <div style={{ color: "red", textAlign: "center" }}>{err}</div>}
        <div className="form-group">
          <label>Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn" type="submit">Login</button>
      </form>
    </div>
  );
}
