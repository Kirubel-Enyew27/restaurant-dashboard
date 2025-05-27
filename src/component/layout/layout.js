import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./layout.css";

const Layout = () => {
  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <aside className="sidebar">
        {/* Admin Profile Section */}
        <div className="admin-profile">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Admin"
            className="profile-pic"
          />
          <div className="profile-info">
            <h3>Admin User</h3>
            <p>admin@restaurant.com</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/customers">Customers</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
            <li>
              <Link to="/foods">Foods</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet /> {/* This will render the matched route component */}
      </main>
    </div>
  );
};

export default Layout;
