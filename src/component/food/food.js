import React, { useEffect, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from "../axiosInstance/axiosInstance";
import "./food.css";

const Food = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const foodsPerPage = 10;

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

  useEffect(() => {
    fetchFoods();
  }, []);

  // Pagination logic
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
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2>Foods</h2>
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
                          <button className="edit-button">
                            <FaPen className="edit-icon" />
                          </button>
                          <button className="delete-button">
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
