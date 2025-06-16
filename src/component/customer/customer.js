import React, { useEffect, useState } from "react";
import { FaPen, FaPlus, FaSearch, FaTrash, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Axios from "../axiosInstance/axiosInstance";
import Notification from "../notification/notification";
import "./customer.css";

const Customer = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

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

  const handleSearch = async () => {
    const q = searchTerm.trim();
    setCurrentPage(1);

    if (q === "") {
      fetchUsers(); // Empty search shows all customers
      return;
    }

    setLoading(true);
    try {
      const response = await Axios.get("/v1/customers/search", {
        params: { q },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();

    setTimeout(() => {
      navigate("/admin/register");
    }, 300);
  };

  const handleEdit = async (event, id) => {
    event.preventDefault();
    setTimeout(() => {
      navigate(`/profile/${id}`);
    }, 300);
  };

  const MySwal = withReactContent(Swal);

  const handleDelete = (id, username) => {
    MySwal.fire({
      title: `Delete ${username}?`,
      text: "Are you sure you want to delete this customer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.delete(`/v1/customer/delete/${id}`);
          toast.success("Customer deleted!");
          fetchUsers();
        } catch (error) {
          toast.error("Failed to delete.");
        }
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [users, totalPages, currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="customer-container">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="customer-search">
            <FaUsers />
            Customers
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
            <button className="add-btn" onClick={handleClick}>
              <FaPlus />
              <span> Add</span>
            </button>
          </div>
          {users.length === 0 ? (
            <p className="no-data">No customers found.</p>
          ) : (
            <>
              <div className="customer-table-container">
                <table className="customer-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => (
                      <tr key={`${user.UserID}-${index}`}>
                        <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                        <td>{user.Username}</td>
                        <td>{user.Email}</td>
                        <td>
                          <button
                            className="edit-button"
                            onClick={(event) => handleEdit(event, user.UserID)}
                          >
                            <FaPen className="edit-icon" />
                          </button>
                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDelete(user.UserID, user.Username)
                            }
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

export default Customer;
