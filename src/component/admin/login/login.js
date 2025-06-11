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
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from "../../axiosInstance/axiosInstance";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      username: username.trim(),
      password: password.trim(),
    };

    if (!userData.username || !userData.password) {
      toast.error("Username and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await Axios.post("/v1/customer/login", userData);
      toast.success("Login successful!");

      const token = response.data.data;
      localStorage.setItem("token", token);

      setTimeout(() => {
        navigate("/");
      }, 1000);

      setUsername("");
      setPassword("");
    } catch (err) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();

    setTimeout(() => {
      navigate("/admin/register");
    }, 300);
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <Card className="login-card">
              <Card.Body>
                <h2 className="text-center mb-4">Login</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formUsername" className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <div>
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
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
                        "Login"
                      )}
                    </Button>
                  </div>

                  {/* Styled Register Link */}
                  <div className="text-center mt-3">
                    Don't have an account?
                    <Button
                      variant="link"
                      onClick={handleClick}
                      className="register-link"
                    >
                      Register here
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

export default Login;
