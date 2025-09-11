import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUserFromToken, logout } from "../utils/auth";
import { ArrowLeft } from "react-feather";

export default function Nav() {
  const user = getUserFromToken();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ background: "#0f172a", color: "#fff", padding: "12px 20px" }}>
      <div className="nav" style={{ alignItems: "center" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* Back Arrow (only visible if not on dashboard) */}
          {location.pathname !== "/dashboard" && (
            <button
              onClick={() => navigate(-1)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <strong style={{ fontSize: 18 }}>MERN CRM</strong>
          {user && (
            <span
              className="pill"
              style={{ background: "#2563eb", color: "#fff", fontWeight: 500 }}
            >
              Role: {user.role}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {user ? (
            <>
              <button className="btn" onClick={() => navigate("/dashboard")}>
                Dashboard
              </button>
              <button className="btn" onClick={() => navigate("/customers")}>
                Customers
              </button>
              <button
                className="btn"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn">Login</button>
              </Link>
              <Link to="/register">
                <button className="btn">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
