import jwtDecode from "jwt-decode";

export const saveAuth = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user)); // full user object
  localStorage.setItem("token", token);
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return { ...user, id: decoded.id, role: decoded.role };
  } catch {
    return null;
  }
};
