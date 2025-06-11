import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import Axios from "../../axiosInstance/axiosInstance";

function Add() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [img_url, setImgUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const foodData = {
      name,
      price,
      img_url,
    };

    try {
      const response = await Axios.post("/v1/food/add", foodData);
      setMessage(response.data.data.message || "food added successfully!");
      setError(false);
      setName("");
      setPrice();
      setImgUrl("");
    } catch (err) {
      setMessage(err.response?.data?.message || "failed to add food");
      setError(true);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Add Food</h2>
          {message && (
            <Alert variant={error ? "danger" : "success"}>{message}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Food Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Food Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formImage">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Image URL"
                value={img_url}
                onChange={(e) => setImgUrl(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Add
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Add;
