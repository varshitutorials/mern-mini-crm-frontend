import React, { useEffect, useState } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Customers() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" });
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  const fetch = async () => {
    const res = await client.get("/customers", { params: { q, page, limit } });
    setItems(res.data.items);
    setTotal(res.data.total);
  };

  useEffect(() => { fetch(); }, [q, page]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await client.put(`/customers/${editing._id}`, form);
        setEditing(null);
      } else {
        await client.post("/customers", form);
      }
      setForm({ name: "", email: "", phone: "", company: "" });
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this customer and its leads?")) return;
    await client.delete(`/customers/${id}`);
    fetch();
  };

  return (
    <div>
      <div className="header">
        <h2>Customers</h2>
        <div className="flex">
          <input
            className="input"
            placeholder="Search by name or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="input"
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <button className="btn" type="submit">{editing ? "Update" : "Add"}</button>
            {editing && (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setEditing(null);
                  setForm({ name: "", email: "", phone: "", company: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan="5" className="center small">No customers</td>
            </tr>
          )}
          {items.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.company}</td>
              <td className="flex">
                <button className="btn" onClick={() => navigate(`/customers/${c._id}`)}>View</button>
                <button
                  className="btn"
                  onClick={() => {
                    setEditing(c);
                    setForm({ name: c.name, email: c.email, phone: c.phone, company: c.company });
                  }}
                >
                  Edit
                </button>
                <button className="btn" onClick={() => remove(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="small">Total: {total}</div>
        <div className="flex">
          <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <div className="small">Page {page}</div>
          <button className="btn" disabled={page * limit >= total} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}
