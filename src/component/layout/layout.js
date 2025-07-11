import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import "./layout.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from "../axiosInstance/axiosInstance";

const Layout = () => {
  const [collabse, setCollabse] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeLink, setActiveLink] = useState("");
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserID(decoded.id);
      } catch (error) {
        console.error("Invalid token:", error);
        toast.error("Invalid token. Please login again.");
      }
    }
  }, [token]);

  useEffect(() => {
    if (userID) {
      const fetchUserData = async () => {
        try {
          const response = await Axios.get(`/v1/customer/${userID}`);
          setUser(response.data.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load user profile.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userID]);

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };
  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <aside className={collabse ? "collabsed-sidebar" : "sidebar"}>
        {/* Admin Profile Section */}
        <div className="admin-profile">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <img
                src={user?.ProfilePicture?.String}
                alt="Admin"
                className="profile-pic"
              />
              <div className="profile-info">
                <h3>{user?.Username || "Admin User"}</h3>
                <p>{user?.Email || "admin@restaurant.com"}</p>
              </div>
            </>
          )}
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
