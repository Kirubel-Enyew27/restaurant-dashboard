import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./component/admin/login/login";
import Register from "./component/admin/register/register";
import Customer from "./component/customer/customer";
import Dashboard from "./component/dashboard/dashboard";
import Add from "./component/food/add-food/add-food";
import Food from "./component/food/food";
import RestaurantDashboard from "./component/layout/layout";
import Order from "./component/order/order";
import Profile from "./component/profile/profile";

function PrivateRoute({ userLoggedIn, children }) {
  return userLoggedIn ? children : <Navigate to="/admin/login" />;
}

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        jwtDecode(token);
        setUserLoggedIn(true);
      } catch (error) {
        console.error("Invalid token:", error);
        toast.error("Invalid token. Please login again.");
        localStorage.removeItem("token");
        setUserLoggedIn(false);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin/register" element={<Register />} />
        <Route path="admin/login" element={<Login />} />
        <Route path="/food/add" element={<Add />} />
        <Route path="/food/update/:id" element={<Add />} />
        <Route
          path="/"
          element={
            <PrivateRoute userLoggedIn={userLoggedIn}>
              <RestaurantDashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customer />} />
          <Route path="orders" element={<Order />} />
          <Route path="foods" element={<Food />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
