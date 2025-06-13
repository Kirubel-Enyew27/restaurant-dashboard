import React, { useEffect, useState } from "react";
import { FaBell, FaDollarSign, FaShoppingCart, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from "../axiosInstance/axiosInstance";
import "./dashboard.css";
import Notification from "../notification/notification";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  var totalRevenue = 0.0;
  orders.forEach((order) => {
    const price = parseFloat(order.total_price);
    if (!isNaN(price)) {
      totalRevenue += price;
    }
  });

  const stats = [
    {
      title: "Orders",
      value: orders.length,
      icon: <FaShoppingCart className="stat-icon" />,
      color: "#e96b45",
    },
    {
      title: "Customers",
      value: users.length,
      icon: <FaUsers className="stat-icon" />,
      color: "#4CAF50",
    },
    {
      title: "Total Revenue",
      value: "ETB " + totalRevenue,
      icon: <FaDollarSign className="stat-icon" />,
      color: "#2196F3",
    },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await Axios.get("/v1/orders");
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await Axios.get("/v1/customers");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2>
            Dashboard
            <Notification />
          </h2>
          <div className="dashboard-container">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="stat-card"
                  style={{
                    borderBottom: `4px solid ${stat.color}`,
                  }}
                >
                  <div className="stat-content">
                    <div className="stat-text">
                      <div
                        className="stat-icon-container"
                        style={{ color: stat.color }}
                      >
                        {stat.icon}
                      </div>
                      <h3>{stat.title}</h3>
                      <p className="stat-value">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Dashboard;
