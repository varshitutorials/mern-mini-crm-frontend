import client from "./client";

// Fetch leads for a customer
export const getLeads = async (customerId, status = "") => {
  const res = await client.get(`/leads/${customerId}`, {
    params: { status }
  });
  return res.data;
};

// Create a new lead
export const createLead = async (customerId, data) => {
  const res = await client.post(`/leads/${customerId}`, data);
  return res.data;
};

// Update a lead
export const updateLead = async (customerId, leadId, data) => {
  const res = await client.put(`/leads/${customerId}/${leadId}`, data);
  return res.data;
};

// Delete a lead
export const deleteLead = async (customerId, leadId) => {
  const res = await client.delete(`/leads/${customerId}/${leadId}`);
  return res.data;
};
