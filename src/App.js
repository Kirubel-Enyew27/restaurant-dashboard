import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Customer from "./component/customer/customer";
import Dashboard from "./component/dashboard/dashboard";
import Food from "./component/food/food";
import RestaurantDashboard from "./component/layout/layout";
import Order from "./component/order/order";
import Profile from "./component/profile/profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RestaurantDashboard />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customer />} />
          <Route path="orders" element={<Order />} />
          <Route path="foods" element={<Food />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
