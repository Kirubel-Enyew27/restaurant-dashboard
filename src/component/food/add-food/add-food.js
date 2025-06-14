import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../admin/login/login.css"; // Reuse login styles
import Axios from "../../axiosInstance/axiosInstance";

function Add() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [img_url, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !price || !img_url.trim()) {
      toast.error("All fields are required");
      return;
    }

    const foodData = {
      name: name.trim(),
      price,
      img_url: img_url.trim(),
    };

    setLoading(true);

    try {
      const response = await Axios.post("/v1/food/add", foodData);
      toast.success(
        response?.data?.data?.message || "Food added successfully!"
      );
      setName("");
      setPrice("");
      setImgUrl("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add food");
    } finally {
      setLoading(false);
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
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter image URL"
                      value={img_url}
                      onChange={(e) => setImgUrl(e.target.value)}
                      required
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

export default Add;
