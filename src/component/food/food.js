import React, { useEffect, useState } from "react";
import { FaPen, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { GiHotMeal } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Axios from "../axiosInstance/axiosInstance";
import Notification from "../notification/notification";
import "./food.css";

const Food = () => {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const foodsPerPage = 10;
  const navigate = useNavigate();

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const response = await Axios.get("/v1/foods");
      setFoods(response.data.data);
    } catch (error) {
      console.error("Error fetching foods:", error);
      toast.error("Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const q = searchTerm.trim();
    setCurrentPage(1);

    if (q === "") {
      fetchFoods();
      return;
    }

    setLoading(true);
    try {
      const response = await Axios.get("/v1/foods/search", {
        params: { q },
      });
      setFoods(response.data.data);
    } catch (error) {
      console.error("Error searching foods:", error);
      toast.error("Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAdd = (event) => {
    event.preventDefault();
    navigate("/food/add");
  };

  const handleEdit = (event, id) => {
    event.preventDefault();
    navigate(`/food/update/${id}`);
  };

  const MySwal = withReactContent(Swal);

  const handleDelete = (id, name) => {
    MySwal.fire({
      title: `Delete ${name}?`,
      text: "Are you sure you want to delete this food?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.delete(`/v1/food/delete/${id}`);
          toast.success("Food deleted!");
          fetchFoods();
        } catch (error) {
          toast.error("Failed to delete.");
        }
      }
    });
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const indexOfLastFood = currentPage * foodsPerPage;
  const indexOfFirstFood = indexOfLastFood - foodsPerPage;
  const currentFoods = foods.slice(indexOfFirstFood, indexOfLastFood);
  const totalPages = Math.ceil(foods.length / foodsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="food-container">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="food-search">
            <GiHotMeal />
            Foods
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
            <button className="add-btn" onClick={handleAdd}>
              <FaPlus />
              <span> Add</span>
            </button>
          </div>
          {foods.length === 0 ? (
            <p>No foods found.</p>
          ) : (
            <>
              <div className="food-table-container">
                <table className="food-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Food</th>
                      <th>Picture</th>
                      <th>Price</th>
                      <th>Available</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentFoods.map((food, index) => (
                      <tr key={food.MealID}>
                        <td>{(currentPage - 1) * foodsPerPage + index + 1}</td>
                        <td>{food.Name}</td>
                        <td>
                          <img
                            src={food.ImgUrl}
                            alt={food.Name}
                            className="food-image"
                          />
                        </td>
                        <td>ETB {food.Price}</td>
                        <td>
                          {food.Available.Bool && food.Available.Valid
                            ? "Yes"
                            : "No"}
                        </td>
                        <td>
                          <button
                            className="edit-button"
                            onClick={(event) => handleEdit(event, food.MealID)}
                          >
                            <FaPen className="edit-icon" />
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(food.MealID, food.Name)}
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

export default Food;
