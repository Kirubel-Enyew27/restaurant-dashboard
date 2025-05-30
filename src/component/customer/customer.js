import React, { useEffect, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from "../axiosInstance/axiosInstance";
import "./customer.css";

const Customer = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

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
    fetchUsers();
  }, []);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="customer-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2>Customers</h2>
          {users.length === 0 ? (
            <p>No customers found.</p>
          ) : (
            <>
              <table className="customer-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    {/* <th>ID</th> */}
                    <th>Username</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user.UserID}>
                      <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                      {/* <td>{user.UserID}</td> */}
                      <td>{user.Username}</td>
                      <td>{user.Email}</td>
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

export default Customer;
