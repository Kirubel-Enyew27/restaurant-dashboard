import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import "./layout.css";

const Layout = () => {
  const [collabse, setCollabse] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };
  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <aside className={collabse ? "collabsed-sidebar" : "sidebar"}>
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
              <Link
                to="/dashboard"
                className={`link ${activeLink === "dashboard" ? "active" : ""}`}
                onClick={() => handleLinkClick("dashboard")}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/customers"
                className={`link ${activeLink === "customers" ? "active" : ""}`}
                onClick={() => handleLinkClick("customers")}
              >
                Customers
              </Link>
            </li>
            <li>
              <Link
                to="/foods"
                className={`link ${activeLink === "foods" ? "active" : ""}`}
                onClick={() => handleLinkClick("foods")}
              >
                Foods
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className={`link ${activeLink === "orders" ? "active" : ""}`}
                onClick={() => handleLinkClick("orders")}
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`link ${activeLink === "profile" ? "active" : ""}`}
                onClick={() => handleLinkClick("profile")}
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <FaBars onClick={() => setCollabse(!collabse)} className="collabse-bar" />

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet /> {/* This will render the matched route component */}
      </main>
    </div>
  );
};

export default Layout;
