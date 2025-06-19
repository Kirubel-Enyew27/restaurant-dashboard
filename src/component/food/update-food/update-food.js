import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../admin/login/login.css";
import Axios from "../../axiosInstance/axiosInstance";

function UpdateFood() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [img_url, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await Axios.get(`/v1/food/${id}`);
        const { Name, Price, ImgUrl } = response.data.data;
        setName(Name);
        setPrice(Price);
        setImgUrl(ImgUrl);
      } catch (err) {
        toast.error("Failed to load food data");
      }
    };

    fetchFood();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fileds = name.trim() || price || selectedImage;

    if (!fileds) {
      toast.error("Atleast one field is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("price", price);
    formData.append("food_picture", selectedImage);

    setLoading(true);
    try {
      const response = await Axios.patch(`/v1/food/update/${id}`, formData, {
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
                <h2 className="text-center mb-4">Update Food</h2>
                <img
                  src={previewImage || img_url}
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formPrice" className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter price"
                      value={price}
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
                        "Update"
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

export default UpdateFood;
