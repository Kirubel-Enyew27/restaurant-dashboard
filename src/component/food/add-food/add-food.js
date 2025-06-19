import React, { useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../admin/login/login.css";
import Axios from "../../axiosInstance/axiosInstance";

function AddFood() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !price) {
      toast.error("All fields are required");
      return;
    }

    if (!selectedImage) {
      toast.error("Please upload a food image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("price", price);
    formData.append("food_picture", selectedImage);

    setLoading(true);
    try {
      const response = await Axios.post("/v1/food/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        response?.data?.data?.message || "Food added successfully!"
      );
      setTimeout(() => navigate("/foods"), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add food");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={5}>
            <Card className="login-card">
              <Card.Body>
                <h2 className="text-center mb-4">Add Food</h2>
                <img
                  src={
                    previewImage ||
                    "https://t3.ftcdn.net/jpg/02/41/30/72/360_F_241307210_MjjaJC3SJy2zJZ6B7bKGMRsKQbdwRSze.jpg"
                  }
                  alt="Food Picture"
                  style={{
                    maxWidth: "200px",
                    height: "200px",
                    borderRadius: "5%",
                    alignContent: "center",
                  }}
                />
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Food Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter food name"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formPrice" className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter price"
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formImage" className="mb-3">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                      type="file"
                      placeholder="Enter image URL"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </Form.Group>

                  <div className="text-center">
                    <Button
                      variant="primary"
                      type="submit"
                      className="login-btn mt-3 w-50"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AddFood;
