import React, { useEffect, useState } from "react";
import { FaPen, FaPlus, FaReceipt, FaSearch, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Axios from "../axiosInstance/axiosInstance";
import Notification from "../notification/notification";
import "./order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

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

  const handleSearch = async () => {
    const q = searchTerm.trim();
    setCurrentPage(1);

    if (q === "") {
      fetchOrders(); // Empty search shows all orders
      return;
    }

    setLoading(true);
    try {
      const response = await Axios.get("/v1/orders/search", {
        params: { q },
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error searching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const MySwal = withReactContent(Swal);

  const handleDelete = (id) => {
    MySwal.fire({
      title: `Delete order?`,
      text: "Are you sure you want to delete this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.delete(`/v1/order/delete/${id}`);
          toast.success("Order deleted!");
          fetchOrders();
        } catch (error) {
          toast.error("Failed to delete.");
        }
      }
    });
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
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="order-search">
            <FaReceipt />
            Orders
            <input
              type="text"
              placeholder="Search..."
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button className="search-btn" onClick={handleSearch}>
              <FaSearch />
            </button>
            <Notification />
            <button className="add-btn" disabled>
              <FaPlus />
              <span> Add</span>
            </button>
          </div>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <>
              <div className="order-table-container">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>No.</th>
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
                            <p key={item.id}>{item.name}</p>
                          ))}
                        </td>
                        <td>
                          {order.OrderItem.map((item) => (
                            <p key={item.id}>{item.quantity.Int32}</p>
                          ))}
                        </td>
                        <td>
                          {order.OrderItem.map((item) => (
                            <p key={item.id}>{item.price}</p>
                          ))}
                        </td>
                        <td>{order.total_price}</td>
                        <td>{order.order_status.String}</td>
                        <td>{order.User.Username}</td>
                        <td>
                          <button className="edit-button" disabled>
                            <FaPen className="edit-icon" />
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(order.order_id)}
                          >
                            <FaTrash className="delete-icon" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
