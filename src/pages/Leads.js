import React, { useEffect, useState } from "react";
import { getLeads, createLead, deleteLead } from "../api/leads";
import { useParams } from "react-router-dom";

const Leads = () => {
  const { customerId } = useParams();
  const [leads, setLeads] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("New");
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  // function to fetch leads from backend
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await getLeads(customerId);
      setLeads(data);
    } catch (err) {
      console.error("Error fetching leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [customerId]);

  // Add new lead
  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      await createLead(customerId, { title, description, status, value });
      await fetchLeads(); // refresh from DB
      setTitle("");
      setDescription("");
      setStatus("New");
      setValue(0);
    } catch (err) {
      console.error("Error creating lead", err);
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId) => {
    try {
      await deleteLead(customerId, leadId);
      await fetchLeads(); // refresh from DB
    } catch (err) {
      console.error("Error deleting lead", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Leads for Customer {customerId}</h2>

      {/* Add Lead Form */}
      <form onSubmit={handleAddLead} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>
        <input
          type="number"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <button type="submit">Add Lead</button>
      </form>

      {/* Lead List */}
      {loading ? (
        <p>Loading leads...</p>
      ) : leads.length > 0 ? (
        <ul>
          {leads.map((lead) => (
            <li key={lead._id}>
              <strong>{lead.title}</strong> ({lead.status}) - ${lead.value}
              <button onClick={() => handleDeleteLead(lead._id)} style={{ marginLeft: "10px" }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No leads found</p>
      )}
    </div>
  );
};

export default Leads;
