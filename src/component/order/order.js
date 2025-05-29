import React, { useEffect, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from "../axiosInstance/axiosInstance";
import "./order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

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

  useEffect(() => {
    fetchOrders();
  }, []);

  // Pagination logic
  const indexOfLastUser = currentPage * ordersPerPage;
  const indexOfFirstUser = indexOfLastUser - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="order-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2>Orders</h2>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <>
              <table className="order-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    {/* <th>ID</th> */}
                    <th>Order Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Customer</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order, index) => (
                    <tr key={order.order_id}>
                      <td>{(currentPage - 1) * ordersPerPage + index + 1}</td>
                      <td>
                        {order.OrderItem.map((item) => (
                          <p>{item.meal_id}</p>
                        ))}
                      </td>
                      <td>
                        {order.OrderItem.map((item) => (
                          <p>{item.quantity.Int32}</p>
                        ))}
                      </td>
                      <td>
                        {order.OrderItem.map((item) => (
                          <p>{item.price}</p>
                        ))}
                      </td>
                      <td>{order.total_price}</td>
                      <td>{order.order_status.String}</td>
                      <td>{order.User.Username}</td>
                      <td>
                        <button className="edit-button">
                          <FaPen className="edit-icon" />
                        </button>{" "}
                        <button className="delete-button">
                          <FaTrash className="delete-icon" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button onClick={handlePrev} disabled={currentPage === 1}>
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Order;
