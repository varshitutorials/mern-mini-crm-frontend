import React, { useEffect, useState } from "react";
import client from "../api/client";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await client.get("/customers/report/leads-by-status");
      setStats(res.data.stats || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const labels = stats.map((s) => s._id || "Unknown");
  const counts = stats.map((s) => s.count || 0);
  const values = stats.map((s) => s.totalValue || 0);

  return (
    <div className="container">
      <div className="header">
        <h2 style={{ marginBottom: "16px" }}>📊 Dashboard</h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <div className="card">
          <h4 className="card-title">Leads by Status</h4>
          {loading ? (
            <p className="small">Loading...</p>
          ) : (
            <Pie
              data={{
                labels,
                datasets: [
                  {
                    data: counts,
                    backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"],
                  },
                ],
              }}
            />
          )}
        </div>

        <div className="card">
          <h4 className="card-title">Total Value by Status</h4>
          {loading ? (
            <p className="small">Loading...</p>
          ) : (
            <Bar
              data={{
                labels,
                datasets: [
                  {
                    data: values,
                    label: "Value",
                    backgroundColor: "#2563eb",
                  },
                ],
              }}
              options={{
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
