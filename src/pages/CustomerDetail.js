import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState({ title: "", description: "", status: "New", value: 0 });
  const [editing, setEditing] = useState(null);

  const fetch = async () => {
    const res = await client.get(`/customers/${id}`);
    setCustomer(res.data.customer);
    setLeads(res.data.leads);
  };

  useEffect(() => { fetch(); }, [id]);

  const fetchLeads = async () => {
    const res = await client.get(`/customers/${id}/leads`, { params: { status: statusFilter } });
    setLeads(res.data);
  };

  useEffect(() => { fetchLeads(); }, [statusFilter]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await client.put(`/customers/${id}/leads/${editing._id}`, form);
        setEditing(null);
      } else {
        await client.post(`/customers/${id}/leads`, form);
      }
      setForm({ title: "", description: "", status: "New", value: 0 });
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const editLead = (l) => {
    setEditing(l);
    setForm({ title: l.title, description: l.description, status: l.status, value: l.value });
  };

  const delLead = async (leadId) => {
    if (!window.confirm("Delete lead?")) return;
    await client.delete(`/customers/${id}/leads/${leadId}`);
    fetch();
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <div>
      <div className="header">
        <h2>{customer.name}</h2>
        <div className="small">{customer.company} • {customer.email}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>New</option>
              <option>Contacted</option>
              <option>Converted</option>
              <option>Lost</option>
            </select>
            <input className="input" type="number" min="0" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
            <button className="btn" type="submit">{editing ? "Update" : "Add Lead"}</button>
            {editing && <button type="button" className="btn" onClick={() => { setEditing(null); setForm({ title: "", description: "", status: "New", value: 0 }); }}>Cancel</button>}
          </div>
          <div className="form-group">
            <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="2" />
          </div>
        </form>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Leads</h3>
          <div className="flex">
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Converted</option>
              <option>Lost</option>
            </select>
            <button className="btn" onClick={() => fetchLeads()}>Filter</button>
          </div>
        </div>

        <table className="table">
          <thead><tr><th>Title</th><th>Status</th><th>Value</th><th>Actions</th></tr></thead>
          <tbody>
            {leads.length === 0 && <tr><td colSpan="4" className="center small">No leads</td></tr>}
            {leads.map((l) => (
              <tr key={l._id}>
                <td>{l.title}</td>
                <td>{l.status}</td>
                <td>{l.value}</td>
                <td className="flex">
                  <button className="btn" onClick={() => editLead(l)}>Edit</button>
                  <button className="btn" onClick={() => delLead(l._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
